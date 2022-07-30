import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as argon from 'argon2';

@Injectable()
export class HelpersService {
  constructor(private configService: ConfigService, private jwt: JwtService) {}
  async hashPassword(password: string): Promise<string> {
    return argon.hash(password);
  }

  async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return argon.verify(hashedPassword, plainPassword);
  }

  async generateAccessToken(userId: string) {
    const payload = {
      userId,
      scope: 'access_token',
    };

    const options: JwtSignOptions = {
      expiresIn: this.configService.getOrThrow<string>(
        'ACCESS_TOKEN_EXPIRATION',
      ),
      secret: this.configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
    };

    return this.jwt.sign(payload, options);
  }

  async generateRefreshToken(userId: string) {
    const payload = {
      userId,
      scope: 'refresh_token',
    };

    const options: JwtSignOptions = {
      secret: this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.getOrThrow<string>(
        'REFRESH_TOKEN_EXPIRATION',
      ),
    };

    return this.jwt.sign(payload, options);
  }
}
