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

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ unique: true, nullable: true })
  otpCode: string;

  @Column({ nullable: true })
  otpCodeCreatedAt: Date;

  @Column({ nullable: true })
  isActivated: boolean;

  @OneToMany(() => Roles, (role) => role.user)
  roles: Roles[];

  @OneToMany(() => Blogs, (author) => author.author)
  blogs: Blogs[];

  @OneToMany(() => Comments, (comment) => comment.user)
  comments: Comments[];

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }
}
