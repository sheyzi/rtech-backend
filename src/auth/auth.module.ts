import { Module } from '@nestjs/common';
import { HelpersModule } from '../helpers/helpers.module';
import { PrismaModule } from '../prisma/prisma.module';
import { VerificationModule } from '../verification/verification.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from './users/users.service';

@Module({
  imports: [PrismaModule, HelpersModule, VerificationModule],
  controllers: [AuthController],
  providers: [AuthService, UsersService, JwtStrategy, JwtAuthGuard],
})
export class AuthModule {}
