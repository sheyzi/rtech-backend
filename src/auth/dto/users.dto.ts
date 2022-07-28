import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Match } from '../../decorators/match.decorator';

export class UserCreateDto {
  @IsNotEmpty({ message: 'First name is required' })
  @ApiProperty({ type: String, required: true, example: 'John' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @ApiProperty({ type: String, required: true, example: 'Doe' })
  lastName: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  @ApiProperty({ type: String, required: true, example: 'johndoe@company.com' })
  email: string;

  @IsNotEmpty({ message: 'Phone number is required' })
  @ApiProperty({ type: String, required: true, example: '+12345678910' })
  phoneNo: string;

  @IsNotEmpty({ message: 'Password is required' })
  @ApiProperty({ type: String, required: true, example: 'Password123!' })
  password: string;

  @IsNotEmpty({ message: 'Confirm password is required' })
  @Match('password', { message: 'Passwords do not match' })
  @ApiProperty({ type: String, required: true, example: 'Password123!' })
  confirmPassword: string;
}

export class UserUpdateDto extends PartialType(
  OmitType(UserCreateDto, ['password', 'confirmPassword'] as const),
) {}
