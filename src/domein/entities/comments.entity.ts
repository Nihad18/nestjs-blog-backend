/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryColumn,
  Generated,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Blogs } from './blogs.entity';
import { Users } from './users.entity';

@Entity()
export class Comments {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column()
  content: string;

  @Column()
  createdTime: string;

  @ManyToOne(() => Comments, (comment) => comment.replies, { nullable: true })
  parent: Comments;

  @OneToMany(() => Comments, (comment) => comment.parent)
  replies: Comments[];

  @ManyToOne(() => Users, (user) => user.comments)
  userId: Users;

  @ManyToOne(() => Blogs, (blog) => blog.comments)
  blogId: Blogs;
}
