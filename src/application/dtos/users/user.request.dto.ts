/* eslint-disable prettier/prettier */

import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';

export class UserRequestDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(7)
  @MaxLength(30)
  password: string;

  @IsString()
  @MaxLength(255)
  profileImg: string;
}
