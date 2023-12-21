/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryColumn,
  Generated,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Comments } from './comments.entity';
import { Tags } from './tags.entity';
import { Users } from './users.entity';

@Entity()
export class Blogs {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column({ default: 0 })
  order: number;

  @Column()
  content: string;

  @Column()
  summary: string;

  @Column({ default: true })
  published: boolean;

  @Column()
  createdTime: string;

  @Column({ nullable: true })
  updatedTime: string;

  @Column()
  coverImg: string;

  @ManyToOne(() => Users, (user) => user.blogs)
  author: Users;

  @OneToMany(() => Comments, (comment) => comment.user)
  comments: Comments[];

  @ManyToMany(() => Tags, (tag) => tag.blogs)
  @JoinTable()
  tags: Tags[];
}
