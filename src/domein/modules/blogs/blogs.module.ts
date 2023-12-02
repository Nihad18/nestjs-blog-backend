/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
// modules
import { TypeOrmModule } from '@nestjs/typeorm';
// controllers
import { BlogsController } from 'src/application/controllers/blogs/blogs.controller';
// entities
import { Blogs, Roles, Users } from 'src/domein/entities';
import { UuidValidationMiddleware } from 'src/domein/middlewares/uuidvalidation.middleware';
// services
import { BlogsService } from 'src/domein/services/blogs/blogs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Roles, Blogs])],
  providers: [BlogsService],
  controllers: [BlogsController],
})
export class BlogModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UuidValidationMiddleware)
      .forRoutes(
        { path: 'blog/:id', method: RequestMethod.GET },
        { path: 'blog/:id', method: RequestMethod.DELETE },
        { path: 'blog/:id', method: RequestMethod.PATCH },
      );
  }
}
