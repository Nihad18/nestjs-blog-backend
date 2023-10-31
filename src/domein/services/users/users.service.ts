/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRequestDto } from 'src/application/dtos/users/user.request.dto';
import { Roles, Users } from 'src/domein/entities';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Roles)
    private readonly roleRepository: Repository<Roles>,
  ) {}

  async getAllUsers(): Promise<any> {
    return this.userRepository.find({
      relations: {
        roles: true,
      },
    });
  }

  async findUserById(id: string): Promise<any> {
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

  async createUser(user: UserRequestDto): Promise<any> {
    const newUser = new Users();
    newUser.fullName = user.fullName;
    newUser.email = user.email;
    newUser.password = user.password;
    newUser.profileImg = user.profileImg;
    try {
      const savedUser = await this.userRepository.save(newUser);

      const newRole = new Roles();
      newRole.user = savedUser;
      newRole.roleName = 'user';
      await this.roleRepository.save(newRole);
      const newRole2 = new Roles();
      newRole2.user = savedUser;
      newRole2.roleName = 'editor';
      await this.roleRepository.save(newRole2);
      const { password, ...result } = savedUser;
      return result;
    } catch (err) {
      throw err;
    }
  }

  private async getUserById(id: string): Promise<any> {
    const user = await this.userRepository.find({ where: { id: id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
