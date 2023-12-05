import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  NotFoundException,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
// dtos
import {
  AuthRequestDto,
  ResetPasswordRequestDto,
} from 'src/application/dtos/auth/auth.request.dto';
import { AuthResponseDto } from 'src/application/dtos/auth/auth.response.dto';
import { UserRequestDto } from 'src/application/dtos/users/user.request.dto';
// services
import { AuthService } from 'src/domein/services/auth/auth.service';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(
    @Body() authRequestDto: AuthRequestDto,
  ): Promise<AuthResponseDto> {
    const response = await this.authService.authenticate(authRequestDto);
    return response;
  }

  @Post('/register')
  @UsePipes(ValidationPipe)
  async register(
    @Body() userRequestDto: UserRequestDto,
  ): Promise<void | object> {
    return this.authService.createUser(userRequestDto);
  }

  @Post('/send-otp')
  async sendOtp(@Body('email') email: string) {
    try {
      const response = await this.authService.sendOtp(email);
      return response;
    } catch (error) {
      return { message: 'Failed to send email', error: error.message };
    }
  }
  @Post('activate-account')
  async activateAccount(
    @Body('email') email: string,
    @Body('otpCode') otpCode: string,
  ): Promise<object | void> {
    try {
      const response = await this.authService.activateAccount(email, otpCode);
      return response;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException({ error: error.message }, HttpStatus.NOT_FOUND);
      } else if (error instanceof HttpException) {
        throw new HttpException({ error: error.message }, error.getStatus());
      } else {
        return { error: 'An unexpected error occurred' };
      }
    }
  }
  @Post('reset-password')
  @UsePipes(ValidationPipe)
  async resetPassoword(
    @Body() resetPasswordRequestDto: ResetPasswordRequestDto,
  ): Promise<object | void> {
    try {
      const response = await this.authService.resetPassword(
        resetPasswordRequestDto,
      );
      return response;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException({ error: error.message }, HttpStatus.NOT_FOUND);
      } else if (error instanceof HttpException) {
        throw new HttpException({ error: error.message }, error.getStatus());
      } else {
        return { error: 'An unexpected error occurred' };
      }
    }
  }
}
