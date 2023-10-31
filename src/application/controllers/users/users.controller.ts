import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserRequestDto } from 'src/application/dtos/users/user.request.dto';
import { Roles } from 'src/domein/decorators/role.decerator';
import { Role } from 'src/domein/enums';
import { JwtAuthGuard } from 'src/domein/guards/jwt-auth-guard';
import { RolesGuard } from 'src/domein/guards/role-guard';
import { UsersService } from 'src/domein/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Roles([Role.Editor])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  getAllUsers(): Promise<any> {
    return this.userService.getAllUsers();
  }

  @Get(':id')
  async findUserById(@Param('id') id: string) {
    try {
      const user = await this.userService.findUserById(id);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(
        'An internal server error occurred.',
      );
    }
  }

  @Post()
  createUser(@Body() user: UserRequestDto) {
    return this.userService.createUser(user);
  }
}
