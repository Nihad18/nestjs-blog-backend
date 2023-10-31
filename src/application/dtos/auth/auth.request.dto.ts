/* eslint-disable prettier/prettier */

import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthRequestDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(7)
  @MaxLength(30)
  password: string;
}
