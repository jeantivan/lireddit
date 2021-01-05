import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Profile extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  fullName!: string;

  @Field(() => String, { nullable: true })
  @Column()
  description?: string;

  @Field(() => String, { nullable: true })
  @Column()
  birthday?: Date;

  @Field()
  @Column({
    default: "/images/avatar.png",
  })
  imageUrl: string;

  @Field(() => User)
  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
