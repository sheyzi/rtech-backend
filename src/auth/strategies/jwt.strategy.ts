import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('ACCESS_TOKEN_SECRET'),
    });
  }

  async validate(payload: any) {
    // Validate scope
    if (payload['scope'] !== 'access_token') {
      throw new UnauthorizedException('Invalid token');
    }

    // Validate user
    const user = await this.usersService.getOne({
      id: payload['userId'],
    });
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    delete user.password;

    return user;
  }
}
