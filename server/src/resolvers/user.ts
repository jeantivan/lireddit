//import { Profile } from "./../entities/Profile";
import argon2 from "argon2";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { getConnection } from "typeorm";
import { v4 } from "uuid";
import { UsernamePasswordInput } from "../inputs/UsernamePasswordInput";
import { sendEmail } from "../utils/sendEmail";
import { COOKIE_NAME, FORGET_PASSWORD_PREFIX } from "./../constants";
import { Post } from "./../entities/Post";
import { Profile } from "./../entities/Profile";
import { Updoot } from "./../entities/Updoot";
import { User } from "./../entities/User";
import { FieldError } from "./../helpers";
import { MyContext } from "./../types";
import { validateRegister } from "./../utils/validateRegister";

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    // Usuario actual y esta bien mostrarle su propio email
    if (req.session.userId === user.id) {
      return user.email;
    }

    // Usuario actual quiere ver el email de alguien mail
    return "";
  }

  @FieldResolver(() => Post)
  async posts(@Root() user: User): Promise<Post[] | null> {
    const posts = await Post.find({ where: { creatorId: user.id } });
    return posts;
  }

  @FieldResolver(() => Profile)
  async profile(@Root() user: User): Promise<Profile | null> {
    const profile = await Profile.findOne({ where: { user: user.id } });

    if (!profile) {
      return null;
    }

    return profile;
  }

  @FieldResolver(() => [Updoot])
  async updoots(@Root() user: User): Promise<Updoot[] | null> {
    console.log(user);
    const updoots = await User.findOne({
      where: { id: user.id },
      relations: ["updoots"],
    });

    if (!updoots) {
      return null;
    }

    return updoots.updoots;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext) {
    // no estas logeado
    if (!req.session.userId) {
      return null;
    }

    const user = await User.findOne(req.session!.userId);

    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors = validateRegister(options);
    if (errors) {
      return {
        errors,
      };
    }

    const hashedPassword = await argon2.hash(options.password);
    let user;
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username: options.username,
          email: options.email,
          password: hashedPassword,
        })
        .returning("*")
        .execute();

      user = result.raw[0];
    } catch (err) {
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: "username already taken",
            },
          ],
        };
      }
    }

    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne(
      usernameOrEmail.includes("@")
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
    );
    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "account doesn't exist",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "incorrect password",
          },
        ],
      };
    }

    // Logea al usuario inicializando una cookie con el id
    req.session!.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err: Error) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // email doesn't exists in DDBB
      return true;
    }

    const token = v4();

    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user.id,
      "ex",
      1000 * 60 * 60 * 24 * 3
    ); // 3 dias

    await sendEmail(
      user.email,
      `<a href="http://localhost:3000/change-password/${token}">Reset password.</a>`
    );
    return true;
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    if (newPassword.length <= 2) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "length must be greater than 2",
          },
        ],
      };
    }

    const key = FORGET_PASSWORD_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }

    const userIdNum = parseInt(userId);
    const user = await User.findOne(userIdNum);

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }

    user.password = await argon2.hash(newPassword);

    await User.update(
      { id: userIdNum },
      { password: await argon2.hash(newPassword) }
    );
    await redis.del(key);

    // logear usuario despues de cambiar la contraseña
    req.session.userId = user.id;

    return { user };
  }
}
