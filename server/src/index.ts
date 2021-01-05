import { ApolloServer } from "apollo-server-express";
import connectRedis from "connect-redis";
import cors from "cors";
import "dotenv-safe/config";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import path from "path";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { COOKIE_NAME, __prod__ } from "./constants";
import { Post } from "./entities/Post";
import { PostImage } from "./entities/PostImage";
import { Profile } from "./entities/Profile";
import { Updoot } from "./entities/Updoot";
import { User } from "./entities/User";
import { createUpdootLoader } from "./loaders/createUpdootLoader";
import { createUserLoader } from "./loaders/createUserLoader";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";
import { ProfileResolver } from "./resolvers/profile";
import { UpdootResolver } from "./resolvers/updoot";
import { UserResolver } from "./resolvers/user";

async function main() {
  const conn = await createConnection({
    type: "postgres",
    url: process.env.DATABASE_URL,
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [Post, User, Updoot, Profile, PostImage],
  });

  // Post.delete({});
  // User.delete({});
  // Updoot.delete({});

  await conn.runMigrations();

  const app = express();

  app.use(express.static(path.join(__dirname, "../public")));

  const RedisStore = connectRedis(session);
  const redis = new Redis(process.env.REDIS_URL);

  app.set("trust proxy", 1);

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 años
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__, // Solo funciona en https
        domain: __prod__ ? ".codeponder.com" : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        HelloResolver,
        PostResolver,
        UserResolver,
        ProfileResolver,
        UpdootResolver,
      ],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      updootLoader: createUpdootLoader(),
    }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(parseInt(process.env.PORT), () => {
    console.log("Server started on localhost:4000");
    console.log(path.join(__dirname, "public"));
  });
}

main().catch((err) => {
  console.log(err);
});
