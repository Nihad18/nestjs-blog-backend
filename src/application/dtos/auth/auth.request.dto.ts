/* eslint-disable prettier/prettier */

import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(7)
  @MaxLength(30)
  password: string;
}
