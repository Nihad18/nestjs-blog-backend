/* eslint-disable prettier/prettier */

import { IsString, IsInt } from 'class-validator';

export class UserResponseDto {
  @IsString()
  name: string;

  @IsInt()
  age: number;

  @IsString()
  breed: string;
}
