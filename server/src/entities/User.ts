import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Post } from "./Post";
import { Profile } from "./Profile";
import { Updoot } from "./Updoot";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Field(() => [Post], { nullable: true })
  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[];

  @Field(() => [Updoot], { nullable: true })
  @OneToMany(() => Updoot, (updoot) => updoot.user)
  updoots: Updoot[];

  @Field(() => Profile, { nullable: true })
  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @Field(() => Int, { nullable: true })
  upvotes: number;

  @Field(() => Int, { nullable: true })
  downvotes: number;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
