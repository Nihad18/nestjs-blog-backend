/* eslint-disable prettier/prettier */
import { Entity, Column, PrimaryColumn, Generated, ManyToOne } from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class Roles {
  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  id: string;

  @Column()
  roleName: string;

  @ManyToOne(() => Users, (user) => user.roles)
  userId: Users;
}
