/* eslint-disable prettier/prettier */

import { IsString, IsEmail, MaxLength, MinLength } from 'class-validator';

export class UserResponseDto {
  @IsString()
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(7)
  @MaxLength(30)
  password: string;

  @IsString()
  @MaxLength(255)
  profileImg: string;
}
