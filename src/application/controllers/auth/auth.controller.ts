import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthRequestDto } from 'src/application/dtos/auth/auth.request.dto';
import { AuthService } from 'src/domein/services/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(
    @Res() res,
    @Body() authRequestDto: AuthRequestDto,
  ): Promise<any> {
    try {
      const response = await this.authService.authenticate(authRequestDto);
      return res.status(HttpStatus.OK).json(response);
    } catch (error) {
      return res.status(error.status).json({ error });
    }
  }
}
