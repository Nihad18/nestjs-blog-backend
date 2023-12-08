/* eslint-disable prettier/prettier */
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import path = require('path');
import { CreateBlogRequestDto } from 'src/application/dtos/blogs/blog.request.dto';
import { Blogs, Tags, Users } from 'src/domein/entities';
import { FileHelper } from 'src/domein/helpers/file-helper';
import { Repository } from 'typeorm';

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blogs)
    private readonly blogRepository: Repository<Blogs>,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Tags)
    private readonly tagsRepository: Repository<Tags>,
    private readonly fileHelper: FileHelper,
  ) {}

  async findBlogById(id: string): Promise<any> {
    const blog = await this.blogRepository.findOne({ where: { id: id } });

    if (!blog) {
      throw new NotFoundException(`Blog with ID ${id} not found`);
    }

    return blog;
  }
  async getAllBlogs(): Promise<any> {
    const blogs = await this.blogRepository.find();
    return blogs;
  }

  async createBlog(
    blogRequestDto: CreateBlogRequestDto,
    file,
    userId: string,
  ): Promise<any> {
    // Check if a user with the provided id exists in the database
    const author = await this.usersRepository.findOne({
      where: { id: userId },
    });

    // If a user doesn`t exists, throw a NotFoundException
    if (!author) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    // If a blog`s slug exists, throw a BadRequestException
    const slug = await this.blogRepository.findOne({
      where: { slug: blogRequestDto.slug },
    });
    if (slug) {
      throw new HttpException('Slug already exists', HttpStatus.BAD_REQUEST);
    }
    if (!file) {
      throw new HttpException('File is required!', HttpStatus.BAD_REQUEST);
    }
    if (file.originalname.length > 100 || file.originalname.length < 10) {
      throw new HttpException(
        'File name must be contain longer than 10 character or shorter than 100 character',
        HttpStatus.BAD_REQUEST,
      );
    }
    const fileName = this.filename(file);
    const coverImg = await this.fileHelper.uploadFile(file, fileName);
    // Create a new Blog entity and fill it with blog data
    const newBlog = new Blogs();
    newBlog.author = author;
    newBlog.slug = blogRequestDto.slug;
    newBlog.content = blogRequestDto.content;
    newBlog.summary = blogRequestDto.summary;
    newBlog.published = blogRequestDto.published;
    newBlog.coverImg = coverImg;
    newBlog.createdTime = new Date().toDateString();

    // Save the new blog to the database
    const savedBlog = await this.blogRepository.save(newBlog);
    // Create a new Tag entity and associate it with the saved blog
    for (const tagDto of blogRequestDto.tags) {
      const tag = new Tags();
      tag.tagName = tagDto.tagName;

      // Associate the tag with the saved blog
      tag.blogs = [savedBlog];
      // Save the tag to create the many-to-many relationship
      await this.tagsRepository.save(tag);
    }
    // Return a success message if the blog creation is successful
    return { message: 'Blog created successfully' };
  }
  //   updateBlog() {}
  //   deleteBlog() {}

  filename(file): string {
    // Generating a 32 random chars long string
    const randomName = (num) =>
      Array(num)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    //if original name greater than 16 we are cutting characters
    //if original name is less than 16 we are adding new characters to the original name
    const formatFileName = (originalname) => {
      if (originalname.length >= 16) {
        return originalname.slice(0, 16);
      } else {
        const padding = randomName(16 - originalname.length);
        return originalname + padding;
      }
    };
    const extension: string = path.parse(file.originalname).ext;
    //Calling the callback passing the random name generated with the original extension name
    return `${randomName(32)}${formatFileName(file.originalname)}${extension}`;
  }
}
