import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { AppHttpException } from 'core/exceptions/http.exception';
import { HttpReason } from 'core/exceptions/http.reasons';
import { Request } from 'express';
import { UserRepository } from 'shared/user/user.repository';

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
      throw new AppHttpException(
        HttpStatus.UNAUTHORIZED,
        'No token provided',
        HttpReason.UNAUTHORIZED,
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('jwt').secret,
      });

      const user = await this.userRepo.findById(payload.sub);

      if (!user) {
        throw new AppHttpException(
          HttpStatus.UNAUTHORIZED,
          'Invalid token or expired',
          HttpReason.UNAUTHORIZED,
        );
      }

      request.user = user;
    } catch (error: any) {
      if (
        error instanceof JsonWebTokenError ||
        error instanceof TokenExpiredError
      ) {
        throw new AppHttpException(
          HttpStatus.UNAUTHORIZED,
          'Invalid token or expired',
          HttpReason.UNAUTHORIZED,
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
