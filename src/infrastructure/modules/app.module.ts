import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/domein/modules/auth/auth.module';
import { BlogModule } from 'src/domein/modules/blogs/blogs.module';
import { UsersModule } from 'src/domein/modules/users/users.module';
import databaseConfig from '../config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig,
    }),
    UsersModule,
    BlogModule,
    AuthModule,
  ],
  controllers: [],
})
export class AppModule {}
