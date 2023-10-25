/* eslint-disable prettier/prettier */

import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsUUID,
} from 'class-validator';

export class UserRequestDto {
  @IsUUID()
  id: string;

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
