import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Request } from 'express';
import { UserRepository } from 'src/shared/user/user.repository';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(
        'You are not logged in! Please log in to get access',
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('jwt').secret,
      });

      const user = await this.userRepo.findById(payload.sub);

      if (!user) {
        throw new UnauthorizedException(
          'The user belonging to this token does no longer exist',
        );
      }

      request['user'] = user;
    } catch (error: any) {
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid token! Please log in again.');
      }

      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(
          'Your token has expired! Please log in again.',
        );
      }

      throw error;
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
