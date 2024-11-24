import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as process from 'node:process';
import { IS_PUBLIC_KEY } from '../common/decorators/public.decorator';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const token = request.headers.authorization?.split(' ');

    if (!authHeader) {
      throw new UnauthorizedException();
    }

    if (token[0] !== 'Bearer') {
      throw new UnauthorizedException();
    }

    if (!token[1]) {
      throw new UnauthorizedException();
    }
    
    try {
      const payload = await this.jwtService.verifyAsync(token[1], {
        secret: process.env.JWT_SECRET,
      });
      request['user'] = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
