/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from 'src/application/controllers/auth/auth.controller';
import { AuthService } from 'src/domein/services/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/domein/guards/jwt-auth-guard';
import { JwtAuthStrategy } from 'src/domein/guards/jwt-auth-strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from 'src/domein/entities/roles.entity';
import { Users } from 'src/domein/entities';
import { RolesGuard } from 'src/domein/guards/role-guard';

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
  ],
  providers: [AuthService, JwtAuthStrategy, JwtAuthGuard, RolesGuard],
  controllers: [AuthController],
})
export class AuthModule {}
