/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from 'src/application/controllers/users/users.controller';
import { Blogs, Roles, Users } from 'src/domein/entities';
import { UuidValidationMiddleware } from 'src/domein/middlewares/uuidvalidation.middleware';
import { UsersService } from 'src/domein/services/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Roles,Blogs])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UuidValidationMiddleware)
      .exclude({
        path: 'users/',
        method: RequestMethod.GET,
      })
      .forRoutes(
        { path: 'users/:id', method: RequestMethod.ALL },
        { path: 'users/change-password/:id', method: RequestMethod.PATCH },
      );
  }
}
