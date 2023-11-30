/* eslint-disable prettier/prettier */

import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class UserRequestDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(7)
  @MaxLength(30)
  password: string;
}

export class UpdateUserRequestDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  fullName: string;
  
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  profileImg: string;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(7)
  @MaxLength(30)
  newPassword: string;

  @IsString()
  @MinLength(7)
  @MaxLength(30)
  oldPassword: string;
}