/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums';

export const Roles = (roles: string[]) => SetMetadata('roles', roles);
