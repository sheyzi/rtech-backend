import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PhoneNumberVerifyDto {
  @IsNotEmpty({ message: 'phoneNo is required' })
  @IsString()
  @ApiProperty({ type: String, required: true })
  phoneNo: string;

  @IsNotEmpty({ message: 'verificationCode is reuqired' })
  @IsString()
  @ApiProperty({ type: String, required: true })
  verificationCode: string;
}
