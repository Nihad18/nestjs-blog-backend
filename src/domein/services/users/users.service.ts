/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// typeorm
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// dtos
import {
  ChangePasswordDto,
  UpdateUserRequestDto,
} from 'src/application/dtos/users/user.request.dto';
import { UserResponseDto } from 'src/application/dtos/users/users.response.dto';
// entities
import { Blogs, Roles, Users } from 'src/domein/entities';
// jwt packages
import * as bcrypt from 'bcrypt';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Roles)
    private readonly roleRepository: Repository<Roles>,
    @InjectRepository(Blogs)
    private readonly blogRepository: Repository<Blogs>,
  ) {}

  async getAllUsers(): Promise<any> {
    return this.userRepository.find({
      relations: {
        roles: true,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        profileImg: true,
        roles: {
          roleName: true,
        },
      },
    });
  }

 
}
