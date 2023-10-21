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

  @Column()
  slug: string;

  @Column()
  content: string;

  @Column()
  summary: string;

  @Column({ default: true })
  published: boolean;

  @Column()
  createdTime: string;

  @Column()
  updatedTime: string;

  @Column()
  coverImg: string;

  @ManyToOne(() => Users, (user) => user.blogs)
  authorId: Users;

  @OneToMany(() => Comments, (comment) => comment.userId)
  comments: Comments[];

  
  @ManyToMany(() => Tags, (tag) => tag.blogs)
  @JoinTable()
  tags: Tags[];
}
