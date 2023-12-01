/* eslint-disable prettier/prettier */
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
//services
import { ConfigService } from '@nestjs/config';
//jwt packages
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
//typorm
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
//dtos
import { AuthRequestDto } from 'src/application/dtos/auth/auth.request.dto';
import { AuthResponseDto } from 'src/application/dtos/auth/auth.response.dto';
//entities
import { Roles, Users } from 'src/domein/entities';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(Roles)
    private readonly configService: ConfigService,
  ) {}


  async authenticate(authRequestDto: AuthRequestDto): Promise<AuthResponseDto> {
    // Find the user in the database based on the provided email
    const foundedUser = await this.userRepository.find({
      where: { email: authRequestDto.email },
      relations: { roles: true },
    });

    // Extract the first user from the result (if any)
    const user = foundedUser[0];

    // If no user is found, throw a NotFoundException
    if (!user) throw new NotFoundException('User not found');

    // Check if the provided password matches the user's stored password
    const isValid = await this.comparePassword(
      authRequestDto.password,
      user.password,
    );

    // If the password is invalid, throw a BadRequestException
    if (!isValid)
      throw new HttpException(
        'Email or password is invalid',
        HttpStatus.BAD_REQUEST,
      );

    // Check if the user account is activated
    if (user.isActivated !== true) {
      // If not activated, throw a HttpException with NOT_ACCEPTABLE status
      throw new HttpException(
        "Account doesn't activated",
        HttpStatus.NOT_ACCEPTABLE,
      );
    }

    // Generate JWT tokens for authentication
    const jwtSecret = this.configService.get('JWT_SECRET');
    const accessToken = sign({ ...user }, jwtSecret, { expiresIn: '1h' });
    const refreshToken = sign({ userId: user.id }, jwtSecret, {
      expiresIn: '7d',
    });

    // Return the generated tokens as part of the AuthResponseDto
    return { accessToken, refreshToken };
  }

  hashPasword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return bcrypt.hash(password, saltOrRounds);
  }

  comparePassword(
    userReqPassword: string,
    userPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(userReqPassword, userPassword);
  }
}
