import { Request, Response } from "express";
import { Redis } from "ioredis";
import { createUpdootLoader } from "./loaders/createUpdootLoader";
import { createUserLoader } from "./loaders/createUserLoader";
declare global {
  namespace Express {
    interface Session {
      userId: number
    }
  }
}
export type MyContext = {
  req: Request & { session: Express.Session };
  res: Response;
  redis: Redis;
  userLoader: ReturnType<typeof createUserLoader>;
  updootLoader: ReturnType<typeof createUpdootLoader>;
};
