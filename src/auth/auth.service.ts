import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SmsService } from '../sms/sms.service';
import { UsersService } from './users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private smsService: SmsService,
    private usersService: UsersService,
  ) {}

  async sendPhoneNumberVerification(phoneNumber: string) {
    // Check if user already exists
    const user = await this.usersService.getOne({ phoneNo: phoneNumber });

    if (!user) {
      throw new NotFoundException('User data does not exist');
    }

    if (user.isPhoneNoConfirmed) {
      throw new BadRequestException('Phone number is already verified');
    }

    // Send verification code
    await this.smsService.initiatePhoneNumberVerification(phoneNumber);
    return { message: 'Verification code sent' };
  }

  async verifyPhoneNumber(phoneNumber: string, verificationCode: string) {
    // Check if user already exists
    const user = await this.usersService.getOne({ phoneNo: phoneNumber });

    if (!user) {
      throw new NotFoundException('User data does not exist');
    }

    if (user.isPhoneNoConfirmed) {
      throw new BadRequestException('Phone number is already verified');
    }

    // Verify verification code
    const isValid = await this.smsService.verifyPhoneNumber(
      phoneNumber,
      verificationCode,
    );

    if (!isValid) {
      throw new BadRequestException('Verification code is invalid');
    }

    // Update user
    await this.usersService.update(
      { id: user.id },
      { isPhoneNoConfirmed: true },
    );
    return { message: 'Phone number verified' };
  }
}
