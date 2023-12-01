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
import { UserRequestDto } from 'src/application/dtos/users/user.request.dto';
//entities
import { Roles, Users } from 'src/domein/entities';
// bullmq
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(Roles)
    private readonly roleRepository: Repository<Roles>,
    private readonly configService: ConfigService,
    @InjectQueue('emailSending') private readonly emailQueue: Queue,
  ) {}

  async sendOtp(email: string) {
    try {
      const user = await this.getUserByEmail(email);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const fullName = await user.fullName;
      // Generate OTP code
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      user.otpCode = otpCode;
      user.otpCodeCreatedAt = new Date();
      await this.userRepository.save(user);

      // Send OTP code via email
      await this.emailQueue.add('send-otp', { email,fullName, otpCode });
      return { message: 'OTP sent successfully' };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  async activateAccount(email: string, otpCode: string) {
    const user = await this.getUserByEmail(email);

    if (!user || user.otpCode !== otpCode) {
      throw new HttpException('Invalid OTP code', HttpStatus.BAD_REQUEST);
    }

    // Check if OTP code is still valid (within 3 minutes)
    const otpCreationTime = user.otpCodeCreatedAt.getTime();
    const currentTime = new Date().getTime();
    const otpValidityDuration = 3 * 60 * 1000;

    if (currentTime - otpCreationTime > otpValidityDuration) {
      throw new HttpException('OTP code has expired', HttpStatus.BAD_REQUEST);
    }

    // Activate the account
    user.isActivated = true;
    user.otpCode = null;
    user.otpCodeCreatedAt = null;
    await this.userRepository.save(user);

    return { message: 'Account activated successfully' };
  }

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

  async createUser(user: UserRequestDto): Promise<void | object> {
    // Check if a user with the provided email already exists in the database
    const userIsExist = await this.userRepository.findOne({
      where: { email: user.email },
    });

    // If a user with the same email exists, throw a BadRequestException
    if (userIsExist) {
      throw new HttpException('Email is used before!', HttpStatus.BAD_REQUEST);
    }

    // Create a new Users entity and populate it with user data
    const newUser = new Users();
    newUser.fullName = user.fullName;
    newUser.email = user.email;
    // Hash the user's password before storing it in the database
    newUser.password = await this.hashPasword(user.password);

    try {
      // Save the new user to the database
      const savedUser = await this.userRepository.save(newUser);

      // Create a new Roles entity and associate it with the saved user
      const newRole = new Roles();
      newRole.user = savedUser;
      newRole.roleName = 'user';

      // Save the new role to the database
      await this.roleRepository.save(newRole);

      // Return a success message if the user creation and role assignment are successful
      return { message: 'User created successfully' };
    } catch (err) {
      // If an error occurs during user creation or role assignment, throw a BadRequestException
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
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

  getUserByEmail(email: string): Promise<any> {
    return this.userRepository.findOne({ where: { email: email } });
  }
}
