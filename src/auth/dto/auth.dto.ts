import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

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
  @IsString()
  @ApiProperty({
    type: String,
    required: true,
    example: '012987',
    description: 'Email code received',
  })
  verificationCode: string;
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
