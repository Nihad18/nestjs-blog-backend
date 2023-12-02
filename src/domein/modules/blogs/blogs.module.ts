/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
// modules
import { TypeOrmModule } from '@nestjs/typeorm';
// controllers
import { BlogsController } from 'src/application/controllers/blogs/blogs.controller';
// entities
import { Blogs, Roles, Users } from 'src/domein/entities';
// services
import { BlogsService } from 'src/domein/services/blogs/blogs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Roles, Blogs])],
  providers: [BlogsService],
  controllers: [BlogsController],
})
export class BlogModule {
}
