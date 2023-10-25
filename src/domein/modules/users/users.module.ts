/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from 'src/application/controllers/users/users.controller';
import { Roles, Users } from 'src/domein/entities';
import { UsersService } from 'src/domein/services/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users,Roles])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
