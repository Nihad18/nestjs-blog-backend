/* eslint-disable prettier/prettier */

import {
  IsAlphanumeric,
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsString,
  IsUppercase,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(7)
  @MaxLength(30)
  @IsLowercase()
  @IsUppercase()
  @IsAlphanumeric()
  password: string;
}
export class ResetPasswordRequestDto {
  @IsString()
  @IsNotEmpty()
  otpCode: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  @MaxLength(30)
  @IsLowercase()
  @IsUppercase()
  @IsAlphanumeric()
  newPassword: string;
}
