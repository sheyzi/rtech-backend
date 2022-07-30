import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HelpersService } from '../helpers/helpers.service';
import { SmsService } from '../sms/sms.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from './users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private smsService: SmsService,
    private usersService: UsersService,
    private helpersService: HelpersService,
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

  async verifyUser(identity: string, password: string) {
    // Check if user already exists
    const user = await this.usersService.getFirst({
      OR: [{ email: identity }, { phoneNo: identity }],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentails!');
    }

    // Verify password
    const isValid = await this.helpersService.verifyPassword(
      password,
      user.password,
    );

    if (!isValid) {
      throw new UnauthorizedException('Invalid credentails!');
    }

    return user;
  }

  async login(data: LoginDto) {
    const user = await this.verifyUser(data.identity, data.password);

    const access_token = await this.helpersService.generateAccessToken(user.id);
    const refresh_token = await this.helpersService.generateRefreshToken(
      user.id,
    );

    return {
      access_token,
      refresh_token,
      type: 'bearer',
    };
  }
}
