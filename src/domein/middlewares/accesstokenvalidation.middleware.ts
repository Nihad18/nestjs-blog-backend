/* eslint-disable prettier/prettier */
import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response, NextFunction } from 'express';
import { Repository } from 'typeorm';
import { Users } from '../entities';

@Injectable()
export class AccessTokenValidationMiddleware implements NestMiddleware {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const userToken = req.headers.authorization;
    const userId = req.params.id;
    const lastToken = (
      await this.userRepository.findOne({ where: { id: userId } })
    ).accessToken;
    if (userToken !== lastToken) {
      throw new HttpException(
        { message: 'Invalid access token', statusCode: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }
    next();
  }
}
