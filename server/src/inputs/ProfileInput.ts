import { InputType, Field } from "type-graphql";

@InputType()
export class ProfileInput {
  @Field()
  fullName: string;

  @Field({ nullable: true })
  imageUrl: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  birthday: Date;
}
