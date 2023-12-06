/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
// modules
import { TypeOrmModule } from '@nestjs/typeorm';
// controllers
import { BlogsController } from 'src/application/controllers/blogs/blogs.controller';
// entities
import { Blogs, Tags, Users } from 'src/domein/entities';
// services
import { BlogsService } from 'src/domein/services/blogs/blogs.service';
// middlewares
import { UuidValidationMiddleware } from 'src/domein/middlewares/uuidvalidation.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Blogs,Tags])],
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
