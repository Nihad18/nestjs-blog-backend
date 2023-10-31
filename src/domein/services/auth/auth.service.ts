/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { AuthRequestDto } from 'src/application/dtos/auth/auth.request.dto';
import { AuthResponseDto } from 'src/application/dtos/auth/auth.response.dto';
import { Users } from 'src/domein/entities';
import { Repository } from 'typeorm';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    private readonly configService: ConfigService,
  ) {}
  async authenticate(authRequestDto: AuthRequestDto): Promise<AuthResponseDto> {
    const foundedUser = await this.userRepository.find({
      where: { email: authRequestDto.email, password: authRequestDto.password },
      relations: { roles: true },
    });
    const user = foundedUser[0];
    if (!user) throw new NotFoundException('user not found');
    const jwtSecret = this.configService.get('JWT_SECRET');
    const accessToken = sign({ ...user }, jwtSecret, { expiresIn: '1h' });
    const refreshToken = sign({ userId: user.id }, jwtSecret, {
      expiresIn: '7d',
    });
    console.log({ accessToken, refreshToken });
    return { accessToken, refreshToken };
  }

  hashPasword(password: string): string {
    const saltOrRounds = 10;
    console.log(bcrypt.hash(password, saltOrRounds).toString());
    return bcrypt.hash(password, saltOrRounds).toString();
  }
}
