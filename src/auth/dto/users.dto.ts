import { OmitType } from '@nestjs/mapped-types';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Match } from '../../decorators/match.decorator';
import { User } from '../../generated/prisma-class/User.entity';

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
  phoneNumber: string;

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

export class ReadUserEntity extends OmitType(User, ['password'] as const) {
  @ApiProperty({
    type: String,
    required: true,
    example: '2644dcf1-ce5d-42a2-97ce-b7f26b6cb95b',
  })
  id: string;

  @ApiProperty({ type: String, required: true, example: 'John' })
  firstName: string;

  @ApiProperty({ type: String, required: true, example: 'Doe' })
  lastName: string;

  @ApiProperty({ type: String, required: true, example: 'johndoe@company.com' })
  email: string;

  @ApiProperty({ type: String, required: true, example: '+12345678910' })
  phoneNo: string;

  @ApiProperty({ enum: Role, required: true, example: Role.USER })
  role: Role;

  @ApiProperty({ type: Boolean, required: true, example: false })
  isPhoneNoConfirmed: boolean;

  @ApiProperty({ type: Boolean, required: true, example: false })
  isEmailConfirmed: boolean;

  @ApiProperty({ type: Boolean, required: true, example: true })
  isActive: boolean;

  @ApiProperty({
    type: Date,
    required: true,
    example: '2020-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    required: true,
    example: '2020-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
