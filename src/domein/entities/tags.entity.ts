/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryColumn,
  Generated,
  ManyToMany,
} from 'typeorm';
import { Blogs } from './blogs.entity';

@Entity()
export class Tags {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column()
  tagName: string;

  @ManyToMany(() => Blogs, (blog) => blog.tags)
  blogs: Blogs[];
}
