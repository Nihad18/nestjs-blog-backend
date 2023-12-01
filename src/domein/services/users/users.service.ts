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

  async findUserById(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.find({
      relations: ['roles'],
      select: {
        id: true,
        fullName: true,
        email: true,
        profileImg: true,
        roles: {
          roleName: true,
        },
      },
      where: {
        id: id,
      },
    });

    if (!user[0]) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user[0];
  }

  async updateUserInfo(
    id: string,
    updateUserDto: UpdateUserRequestDto,
  ): Promise<any> {
    try {
      await this.findUserById(id);

      await this.userRepository.update(id, updateUserDto);

      return { message: 'User updated successfully' };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }

  async changePassword(
    id: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<any> {
    // Find the user in the database based on the provided email
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    // If no user is found, throw a NotFoundException
    if (!user) throw new NotFoundException('');
    const oldPassword = changePasswordDto.oldPassword.trim();
    const newPassword = changePasswordDto.newPassword.trim();
    const result = await bcrypt.compare(oldPassword, user.password);
    if (result) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userRepository.update(id, { password: hashedPassword });
      return { message: 'Password updated successfully' };
    } else {
      throw new BadRequestException('');
    }
  }

  async deleteUser(id: string): Promise<any> {
    const user = await this.findUserById(id);
    const roles = user.roles.map((role) => role.roleName);
    try {
      // Delete relational roles
      await this.roleRepository.delete({ user: { id } });

      if (roles.includes('admin') || roles.includes('editor')) {
        await this.blogRepository.delete({ author: { id } });
      }

      // Delete the user
      await this.userRepository.delete({ id });

      return { message: 'User deleted successfully' };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
