/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
// modules
import { PassportModule } from '@nestjs/passport';
import { BullModule } from '@nestjs/bull';
import { MailerModule } from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
// custom modules
import { JwtAuthGuard } from 'src/domein/guards/jwt-auth-guard';
import { JwtAuthStrategy } from 'src/domein/guards/jwt-auth-strategy';
// entities
import { Roles } from 'src/domein/entities/roles.entity';
import { Users } from 'src/domein/entities';
//guards
import { RolesGuard } from 'src/domein/guards/role-guard';
//services
import { AuthService } from 'src/domein/services/auth/auth.service';
//controllers
import { AuthController } from 'src/application/controllers/auth/auth.controller';
// config files
import mailConfig from '../../../infrastructure/config/mail.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailProcessor } from 'src/domein/mail/processors/email.processor';
import * as dotenv from 'dotenv';
dotenv.config();
@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Roles]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    MailerModule.forRootAsync({
      useFactory: mailConfig,
    }),
    BullModule.forRoot({
      redis: {
        password: process.env.REDIS_PASSWORD,
        host: process.env.REDIS_HOST,
        port: 14763,
      },
    }),
    BullModule.registerQueue({
      name: 'emailSending',
    }),
  ],
  providers: [
    AuthService,
    JwtAuthStrategy,
    JwtAuthGuard,
    RolesGuard,
    EmailProcessor,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
