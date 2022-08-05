import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { HelpersService } from '../helpers/helpers.service';
import { VerificationService } from '../verification/verification.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from './users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private verificationService: VerificationService,
    private usersService: UsersService,
    private helpersService: HelpersService,
  ) {}

  async sendPhoneNumberVerification(phoneNumber: string) {
    // Check if user already exists
    const user = await this.usersService.getOne({ phoneNumber: phoneNumber });

    if (!user) {
      throw new NotFoundException('User data does not exist');
    }

    if (user.isPhoneNumberConfirmed) {
      throw new BadRequestException('Phone number is already verified');
    }

    // Send verification code
    await this.verificationService.initiatePhoneNumberVerification(phoneNumber);
    return { message: 'Verification code sent' };
  }

  async sendEmailVerification(email: string) {
    // Check if user already exists
    const user = await this.usersService.getOne({ email: email });

    if (!user) {
      throw new NotFoundException('User data does not exist');
    }

    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email is already verified');
    }

    // Send verification code
    await this.verificationService.initiateEmailVerification(email);
    return { message: 'Verification code sent' };
  }

  async verifyPhoneNumber(phoneNumber: string, verificationCode: string) {
    // Check if user already exists
    const user = await this.usersService.getOne({ phoneNumber: phoneNumber });

    if (!user) {
      throw new NotFoundException('User data does not exist');
    }

    if (user.isPhoneNumberConfirmed) {
      throw new BadRequestException('Phone number is already verified');
    }

    // Verify verification code
    const isValid = await this.verificationService.verifyPhoneNumber(
      phoneNumber,
      verificationCode,
    );

    if (!isValid) {
      throw new BadRequestException('Verification code is invalid');
    }

    // Update user
    await this.usersService.update(
      { id: user.id },
      { isPhoneNumberConfirmed: true },
    );
    return { message: 'Phone number verified' };
  }

  async verifyEmail(email: string, verificationCode: string) {
    // Check if user already exists
    const user = await this.usersService.getOne({ email });
    if (!user) {
      throw new NotFoundException('User data does not exist');
    }

    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email is already verified');
    }

    // Verify verification code
    const isValid = await this.verificationService.verifyEmail(
      email,
      verificationCode,
    );

    if (!isValid) {
      throw new BadRequestException('Verification code is invalid');
    }

    // Update user
    await this.usersService.update({ id: user.id }, { isEmailConfirmed: true });
    return { message: 'Email verified successfully' };
  }

  async verifyUser(identity: string, password: string) {
    // Check if user already exists
    const user = await this.usersService.getFirst({
      OR: [{ email: identity }, { phoneNumber: identity }],
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

  async refreshToken(token: string) {
    const userId = await this.helpersService.decodeRefreshToken(token);
    const user = await this.usersService.getOne({ id: userId });

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    const accessToken = await this.helpersService.generateAccessToken(userId);
    const refreshToken = await this.helpersService.generateRefreshToken(userId);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      type: 'bearer',
    };
  }

  async sendResetPasswordEmail(email: string) {
    // Check if user already exists
    const user = await this.usersService.getOne({ email });

    if (!user) {
      throw new NotFoundException('User data does not exist');
    }

    // Send reset password code
    await this.verificationService.initiateEmailVerification(email);
    return { message: 'Reset password code sent' };
  }

  async resetPassword(
    email: string,
    verificationCode: string,
    password: string,
  ) {
    // Check if user already exists
    const user = await this.usersService.getOne({ email });

    if (!user) {
      throw new NotFoundException('User data does not exist');
    }

    // Verify verification code
    const isValid = await this.verificationService.verifyEmail(
      email,
      verificationCode,
    );

    if (!isValid) {
      throw new BadRequestException('Verification code is invalid');
    }

    // Hash password
    const hashedPassword = await this.helpersService.hashPassword(password);

    // Update user
    await this.usersService.update(
      { id: user.id },
      { password: hashedPassword },
    );
    return { message: 'Password reset successfully' };
  }
}
