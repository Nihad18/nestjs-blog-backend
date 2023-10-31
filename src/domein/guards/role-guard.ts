/* eslint-disable prettier/prettier */
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler()); // Ensure that the key 'roles' matches your decorator's key
    if (!roles) {
      return true; // No specific role required, allow access
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    // Check if the user has at least one of the required roles
    const hasRequiredRole = roles.some((requiredRole) =>
      user.roles.some((userRole) => userRole.roleName === requiredRole),
    );

    return hasRequiredRole; // Return true if the user has at least one required role, else deny access
  }
}
