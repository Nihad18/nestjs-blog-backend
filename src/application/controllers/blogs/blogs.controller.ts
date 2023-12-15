import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
  Req,
  HttpException,
  Delete,
  Patch,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
// dtos
import {
  CreateBlogRequestDto,
  UpdateBlogRequestDto,
} from 'src/application/dtos/blogs/blog.request.dto';
// decators
import { Roles } from 'src/domein/decorators/role.decerator';
// enums
import { Role } from 'src/domein/enums';
// guards
import { JwtAuthGuard } from 'src/domein/guards/jwt-auth-guard';
import { RolesGuard } from 'src/domein/guards/role-guard';
// services
import { BlogsService } from 'src/domein/services/blogs/blogs.service';

import { Pagination } from 'nestjs-typeorm-paginate';
import { Blogs } from 'src/domein/entities';
@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Get(':id')
  async findBlogById(@Param('id') id: string): Promise<any> {
    try {
      const user = await this.blogsService.findBlogById(id);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(
        'An internal server error occurred.',
      );
    }
  }
  @Get()
  async getAllBlogs(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Req() req: Request,
  ): Promise<Pagination<Blogs>> {
    limit = limit > 100 ? 100 : limit;
    const rootUrl = `${req.protocol}://${req.get('Host')}${req.originalUrl}`;
    return await this.blogsService.getAllBlogs({
      page,
      limit,
      route: rootUrl,
    });
  }
  @Post('/create')
  @Roles([Role.Admin])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  @UseInterceptors(FileInterceptor('coverImg'))
  async createBlog(
    @Body() blogRequestDto: CreateBlogRequestDto,
    @UploadedFile() file,
    @Req() req,
  ): Promise<void | object> {
    try {
      const userId = await req.user.id;
      return this.blogsService.createBlog(blogRequestDto, file, userId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException({ error: error.message }, error.getStatus());
      }
      throw new InternalServerErrorException(
        'An internal server error occurred.',
      );
    }
  }

  @Patch('/:id')
  @Roles([Role.Admin])
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('coverImg'))
  async updateBlog(
    @Param('id') blogId: string,
    @Req() req,
    @Body() blogRequestDto: UpdateBlogRequestDto,
    @UploadedFile() file,
  ): Promise<void | object> {
    try {
      const userId = await req.user.id;
      return this.blogsService.updateBlog(userId, blogId, blogRequestDto, file);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException({ error: error.message }, error.getStatus());
      }
      throw new InternalServerErrorException(
        'An internal server error occurred.',
      );
    }
  }
  @Delete('/:id')
  @Roles([Role.Admin])
  @UseGuards(JwtAuthGuard, RolesGuard)
  async deleteBlog(
    @Param('id') blogId: string,
    @Req() req,
  ): Promise<void | object> {
    try {
      const userId = await req.user.id;
      return this.blogsService.deleteBlog(userId, blogId);
    } catch (error) {
      if (error instanceof HttpException) {
        throw new HttpException({ error: error.message }, error.getStatus());
      }
      throw new InternalServerErrorException(
        'An internal server error occurred.',
      );
    }
  }
}
