/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  PrimaryColumn,
  Generated,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { Blogs } from './blogs.entity';
import { Comments } from './comments.entity';
import { Roles } from './roles.entity';

@Entity()
export class Users {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  profileImg: string;

  @OneToMany(() => Roles, (role) => role.userId)
  roles: Roles[];

  @OneToMany(() => Blogs, (author) => author.authorId)
  blogs: Blogs[];

  @OneToMany(() => Comments, (comment) => comment.userId)
  comments: Comments[];

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
