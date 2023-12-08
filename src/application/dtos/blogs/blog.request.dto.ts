/* eslint-disable prettier/prettier */
import {
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
} from 'class-validator';
import { Tags } from 'src/domein/entities';

export class CreateBlogRequestDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(100)
  slug: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(250)
  @MaxLength(5000)
  content: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(80)
  @MaxLength(250)
  summary: string;

  @IsNotEmpty()
  published: boolean;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  tags: Tags[];
}
