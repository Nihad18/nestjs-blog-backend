/* eslint-disable prettier/prettier */
import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { validate } from 'uuid';

@Injectable()
export class UuidValidationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    // Validate the UUID format
    if (!validate(id)) {
      throw new HttpException(
        { message: 'Invalid UUID format', statusCode: HttpStatus.BAD_REQUEST },
        HttpStatus.BAD_REQUEST,
      );
    }

    next();
  }
}
