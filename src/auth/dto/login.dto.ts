import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'phone number or email is required' })
  @IsString()
  @ApiProperty({
    type: String,
    required: true,
    example: '+12345678910',
    examples: ['+12345678910', 'johndoe@company.com'],
    description: 'Email or Phone number (with country code)',
  })
  identity: string;

  @IsNotEmpty({ message: 'password is required' })
  @IsString()
  @ApiProperty({
    type: String,
    required: true,
    example: 'Password123!',
    description: 'Password for the account',
  })
  password: string;
}

export class LoginSuccessfulType {
  @ApiProperty({
    description: 'Token that should be used to access protected resources',
  })
  access_token: string;

  @ApiProperty({
    description: 'Token to refresh access token (can only be used once)',
  })
  refresh_token: string;

  @ApiProperty({
    example: 'bearer',
    description: 'Type of authentication the tokens should be used for',
  })
  type: string;
}
