import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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

export class PhoneVerifiedSuccessful {
  @ApiProperty({ example: 'Phone number verified' })
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
