import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  NotFoundException,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
// dtos
import {
  ActivateAccountRequestDto,
  AuthRequestDto,
  ResetPasswordRequestDto,
  SendOtpRequestDto,
} from 'src/application/dtos/auth/auth.request.dto';
import { AuthResponseDto } from 'src/application/dtos/auth/auth.response.dto';
// guards
import { UserRequestDto } from 'src/application/dtos/users/user.request.dto';
import { JwtAuthGuard } from 'src/domein/guards/jwt-auth-guard';
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
    try {
      const response = await this.authService.authenticate(authRequestDto);
      return response;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException({ error: error.message }, HttpStatus.NOT_FOUND);
      } else if (error instanceof HttpException) {
        throw new HttpException({ error: error.message }, error.getStatus());
      } else {
        throw new HttpException(
          { error: 'An unexpected error occurred' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  async logOut(@Request() req): Promise<object> {
    try {
      const userId = await req.user.id;
      const response = await this.authService.logOut(userId);
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException({ error: error.message }, error.getStatus());
      } else {
        throw new HttpException({ error }, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Post('/register')
  @UsePipes(ValidationPipe)
  async register(
    @Body() userRequestDto: UserRequestDto,
  ): Promise<void | object> {
    return this.authService.createUser(userRequestDto);
  }

  @Post('/send-otp')
  @UsePipes(ValidationPipe)
  async sendOtp(
    @Body() sendOtpRequestDto: SendOtpRequestDto,
  ): Promise<object | void> {
    const response = await this.authService.sendOtp(sendOtpRequestDto);
    return response;
  }
  @Post('activate-account')
  @UsePipes(ValidationPipe)
  async activateAccount(
    @Body() activateAccountRequestDto: ActivateAccountRequestDto,
  ): Promise<object | void> {
    try {
      const response = await this.authService.activateAccount(
        activateAccountRequestDto,
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
