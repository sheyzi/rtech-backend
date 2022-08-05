import { ApiProperty } from '@nestjs/swagger';
import { IsByteLength, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Match } from '../../decorators/match.decorator';

export class PhoneNumberVerifyDto {
  @IsNotEmpty({ message: 'phoneNo is required' })
  @IsString()
  @ApiProperty({
    type: String,
    required: true,
    example: '+12345678910',
    description: 'Phone number to be verified',
  })
  phoneNo: string;

  @IsNotEmpty({ message: 'verificationCode is reuqired' })
  @IsByteLength(6, 6, { message: 'verificationCode must be 6 characters long' })
  @IsString()
  @ApiProperty({
    type: String,
    required: true,
    example: '012987',
    description: 'SMS code received',
  })
  verificationCode: string;
}

export class EmailVerifyDto {
  @IsNotEmpty({ message: 'email is required' })
  @IsEmail()
  @ApiProperty({
    type: String,
    required: true,
    example: 'johndoe@company.com',
    description: 'Email to be verified',
  })
  email: string;

  @IsNotEmpty({ message: 'verificationCode is reuqired' })
  @IsByteLength(6, 6, { message: 'verificationCode must be 6 characters long' })
  @IsString()
  @ApiProperty({
    type: String,
    required: true,
    example: '012987',
    description: 'Email code received',
  })
  verificationCode: string;
}

export class ResetPasswordDto {
  @IsNotEmpty({ message: 'email is required' })
  @IsEmail()
  @ApiProperty({
    type: String,
    required: true,
    example: 'johndoe@company.com',
    description: "User's email",
  })
  email: string;

  @IsNotEmpty({ message: 'otp is required' })
  @IsByteLength(6, 6, { message: 'otp must be 6 digits' })
  @IsString()
  @ApiProperty({
    type: String,
    required: true,
    example: '012987',
    description: 'OTP received',
  })
  otp: string;

  @IsNotEmpty({ message: 'password is required' })
  @IsString()
  @ApiProperty({
    type: String,
    required: true,
    example: 'NewPassword123!',
    description: 'New password',
  })
  password: string;

  @IsNotEmpty({ message: 'confirmPassword is required' })
  @IsString()
  @Match('password', { message: 'Passwords do not match' })
  @ApiProperty({
    type: String,
    required: true,
    example: 'NewPassword123!',
    description: 'Confirm password',
  })
  confirmPassword: string;
}

export class PhoneVerifiedSuccessful {
  @ApiProperty({ example: 'Phone number verified' })
  message: string;
}

export class EmailVerifiedSuccessful {
  @ApiProperty({ example: 'Email verified successfully' })
  message: string;
}

export class VerificationCodeSentSuccessful {
  @ApiProperty({ example: 'Verification code sent' })
  message: string;
}

export class RefreshTokenDto {
  @ApiProperty({ description: 'refresh token' })
  @IsNotEmpty({ message: 'refresh_token is required' })
  refresh_token: string;
}

export class ResetPasswordSuccessful {
  @ApiProperty({ example: 'Password reset successfully' })
  message: string;
}

export class ResetPasswordCodeSentSuccessful {
  @ApiProperty({ example: 'Reset password code sent' })
  message: string;
}
