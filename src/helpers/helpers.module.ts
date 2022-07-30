import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { HelpersService } from './helpers.service';

@Module({
  providers: [HelpersService],
  exports: [HelpersService],
  imports: [
    JwtModule.register({
      signOptions: {
        algorithm: 'HS256',
        audience: 'rtech_diagnostics_mobile_app',
        issuer: 'rtech_diagnostics',
      },
    }),
    PrismaModule,
  ],
})
export class HelpersModule {}
