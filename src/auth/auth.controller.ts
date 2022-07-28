import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { EnumValidationPipe } from '../pipes/enum.pipe';
import { AuthService } from './auth.service';
import { PhoneNumberVerifyDto } from './dto/auth.dto';
import { UserCreateDto } from './dto/users.dto';
import { UsersService } from './users/users.service';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  // TODO: Implement email verification
  // TODO: Implement reset password mail sending and reset password confirmation
  // TODO: Implement login and refresh token

  @Post('signup')
  @ApiCreatedResponse({
    description: 'User has been successfully created',
  })
  @ApiBadRequestResponse({ description: 'Request body is invalid' })
  @ApiQuery({ name: 'role', enum: Role })
  async signup(
    @Body() data: UserCreateDto,
    @Query(
      'role',
      new EnumValidationPipe(Role),
      new DefaultValuePipe(Role.USER),
    )
    role: Role,
  ) {
    return this.usersService.create(data, role);
  }

  @Get('verify/phone/:phone_no')
  @ApiParam({ name: 'phone_no', type: String })
  @ApiOkResponse({ description: 'Verification sent' })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse({
    description: "User with the phone number doesn't exists",
  })
  async sendPhoneNumberVerificationCode(@Param('phone_no') phone_no: string) {
    if (!phone_no) {
      throw new BadRequestException('Phone number is required');
    }

    return this.authService.sendPhoneNumberVerification(phone_no);
  }

  @Post('verify/phone/confirm')
  @ApiOkResponse({ description: 'Phone number verified successfully' })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse({
    description: "User with the phone number doesn't eexists",
  })
  async verifyPhoneNumber(@Body() data: PhoneNumberVerifyDto) {
    return this.authService.verifyPhoneNumber(
      data.phoneNo,
      data.verificationCode,
    );
  }
}
