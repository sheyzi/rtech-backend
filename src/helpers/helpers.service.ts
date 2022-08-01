import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HelpersService {
  constructor(
    private configService: ConfigService,
    private jwt: JwtService,
    private prismaService: PrismaService,
  ) {}
  async hashPassword(password: string): Promise<string> {
    return argon.hash(password);
  }

  async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return argon.verify(hashedPassword, plainPassword);
  }

  async markTokenAsUsed(token: string, expiresIn: Date) {
    return await this.prismaService.usedToken.create({
      data: { id: token, expiresAt: expiresIn },
    });
  }

  async isTokenUsed(token: string): Promise<boolean> {
    const usedToken = await this.prismaService.usedToken.findUnique({
      where: {
        id: token,
      },
    });
    return !!usedToken;
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

  async decodeRefreshToken(refreshToken: string) {
    try {
      if (await this.isTokenUsed(refreshToken)) {
        throw new UnauthorizedException('Invalid token');
      }
      const payload = this.jwt.verify(refreshToken, {
        algorithms: ['HS256'],
        secret: this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
        audience: 'rtech_diagnostics_mobile_app',
        issuer: 'rtech_diagnostics',
      });
      if (payload['scope'] !== 'refresh_token') {
        throw new UnauthorizedException('Invalid token');
      }

      await this.markTokenAsUsed(refreshToken, new Date(payload['exp']));

      return payload['userId'];
    } catch (e) {
      if (e.name === 'JsonWebTokenError')
        throw new UnauthorizedException('Invalid token');
      throw e;
    }
  }
}
