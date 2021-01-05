import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { getRepository } from "typeorm";
import { Profile } from "../entities/Profile";
import { validateProfile } from "../utils/validateProfile";
import { FieldError } from "./../helpers";
import { ProfileInput } from "./../inputs/ProfileInput";
import { MyContext } from "./../types";

@ObjectType()
class ProfileResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Profile, { nullable: true })
  profile?: Profile;
}

@Resolver(Profile)
export class ProfileResolver {
  @Mutation(() => ProfileResponse)
  async createProfile(
    @Ctx() { req }: MyContext,
    @Arg("options") options: ProfileInput
  ): Promise<ProfileResponse> {
    const errors = validateProfile(options);
    if (errors) {
      return {
        errors,
      };
    }

    const profile = await Profile.create({
      ...options,
      user: req.session.userId,
    }).save();

    console.log(profile);

    return {
      profile,
    };
  }

  @Query(() => Profile, { nullable: true })
  async userProfile(@Arg("username") username: string) {
    // const profile = await getRepository(Profile)
    //   .createQueryBuilder("user")
    //   .where("user.username = :username", { username })
    //   .leftJoinAndSelect("user.profile", "profile")
    //   .leftJoinAndSelect("user.updoots", "updoots")
    //   .addSelect('COUNT("updoots"."value" > 0)', "upvotes")
    //   .addSelect('COUNT("updoots"."value" < 0)', "downvotes")
    //   .groupBy(
    //     '"user"."id", "profile"."id", "updoots"."userId","updoots"."postId" ,"updoots"."value"'
    //   )
    //   .getOne();

    const profile = await getRepository(Profile)
      .createQueryBuilder("profile")
      .leftJoinAndSelect("profile.user", "user")
      .where('"user"."username" = :username', {
        username,
      })
      .getOne();

    console.log(profile);
    return profile;
  }
}
