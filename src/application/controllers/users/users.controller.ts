import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ChangePasswordDto,
  UpdateUserRequestDto,
} from 'src/application/dtos/users/user.request.dto';
import { UserResponseDto } from 'src/application/dtos/users/users.response.dto';
import { Roles } from 'src/domein/decorators/role.decerator';
import { Role } from 'src/domein/enums';
import { JwtAuthGuard } from 'src/domein/guards/jwt-auth-guard';
import { RolesGuard } from 'src/domein/guards/role-guard';
import { UsersService } from 'src/domein/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Roles([Role.Editor, Role.Admin])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  getAllUsers(): Promise<any> {
    return this.userService.getAllUsers();
  }

  // @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findUserById(@Param('id') id: string): Promise<UserResponseDto> {
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

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @UsePipes(ValidationPipe)
  async updateUserInfo(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserRequestDto,
  ): Promise<any> {
    return await this.userService.updateUserInfo(id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password/:id')
  @UsePipes(ValidationPipe)
  async updatePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<any> {
    try {
      return await this.userService.changePassword(id, changePasswordDto);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else if (error instanceof NotFoundException) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Roles([Role.Admin])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<any> {
    return await this.userService.deleteUser(id);
  }
}
