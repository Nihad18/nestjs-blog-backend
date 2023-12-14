/* eslint-disable prettier/prettier */
import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
//entities
import { Blogs, Roles, Users } from 'src/domein/entities';
// middlewares
import { AccessTokenValidationMiddleware } from 'src/domein/middlewares/accesstokenvalidation.middleware';
import { UuidValidationMiddleware } from 'src/domein/middlewares/uuidvalidation.middleware';
//modules
import { TypeOrmModule } from '@nestjs/typeorm';
//controllers
import { UsersController } from 'src/application/controllers/users/users.controller';
//services
import { UsersService } from 'src/domein/services/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Roles, Blogs])],
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

    consumer
      .apply(AccessTokenValidationMiddleware)
      .forRoutes({ path: 'users', method: RequestMethod.ALL });
  }
}
