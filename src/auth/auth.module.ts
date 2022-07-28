import { Module } from '@nestjs/common';
import { HelpersModule } from '../helpers/helpers.module';
import { PrismaModule } from '../prisma/prisma.module';
import { SmsModule } from '../sms/sms.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users/users.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersService],
  imports: [PrismaModule, HelpersModule, SmsModule],
})
export class AuthModule {}
