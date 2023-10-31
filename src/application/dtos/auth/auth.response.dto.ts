/* eslint-disable prettier/prettier */

import { IsString } from 'class-validator';

export class AuthResponseDto {
  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;
}
