import { FieldResolver, Resolver, Root } from "type-graphql";
import { Post } from "./../entities/Post";
import { Updoot } from "./../entities/Updoot";

@Resolver(Updoot)
export class UpdootResolver {
  @FieldResolver()
  async post(@Root() updoot: Updoot): Promise<Post> {
    const result = await Post.findOne(updoot.postId);

    return result!;
  }
}
