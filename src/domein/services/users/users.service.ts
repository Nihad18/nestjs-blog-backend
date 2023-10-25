/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRequestDto } from 'src/application/dtos/users/user.request.dto';
import { Roles, Users } from 'src/domein/entities';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    @InjectRepository(Roles)
    private readonly roleRepository: Repository<Roles>,
  ) {}

  async getAllUsers(): Promise<any> {
    return this.userRepository.find();
  }

  async findUserById(id: string): Promise<any> {
    const user = await this.getUserById(id);
    const { password, ...result } = user;
    return result;
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
      newRole.userId=savedUser;
      newRole.roleName="user";
      await this.roleRepository.save(newRole)

      const { password, ...result } = savedUser;
      return result;
    } catch (err) {
      throw err;
    }
  }

  private async getUserById(id: string): Promise<any> {
    const options: FindOneOptions<Users> = {
      where: { id },
    };
    const user = await this.userRepository.findOne(options);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
