import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserRequestDto } from 'src/application/dtos/users/user.request.dto';
import { UsersService } from 'src/domein/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  getAllUsers(): Promise<any> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  findUserById(id: string) {
    return this.userService.findUserById(id);
  }

  @Post()
  createUser(@Body() user: UserRequestDto) {
    return this.userService.createUser(user);
  }
}
