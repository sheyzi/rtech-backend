import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import {
  BadRequestErrorSwaggerType,
  ConflictErrorSwaggerType,
  NotFoundErrorSwaggerType,
  UnauthorizedErrorSwaggerType,
} from '../constants/error.constant';
import { EnumValidationPipe } from '../pipes/enum.pipe';
import { AuthService } from './auth.service';
import {
  PhoneNumberVerifyDto,
  PhoneVerifiedSuccessful,
  VerificationCodeSentSuccessful,
} from './dto/auth.dto';
import { LoginDto, LoginSuccessfulType } from './dto/login.dto';
import { ReadUserEntity, UserCreateDto } from './dto/users.dto';
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

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: 'Login successful', type: LoginSuccessfulType })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    type: UnauthorizedErrorSwaggerType,
  })
  async login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Post('signup')
  @ApiCreatedResponse({
    description: 'User has been successfully created',
    type: ReadUserEntity,
  })
  @ApiConflictResponse({
    description: 'User data already exists',
    type: ConflictErrorSwaggerType,
  })
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
  @ApiOkResponse({
    description: 'Verification sent',
    type: VerificationCodeSentSuccessful,
  })
  @ApiBadRequestResponse({ type: BadRequestErrorSwaggerType })
  @ApiNotFoundResponse({
    description: "User with the phone number doesn't exists",
    type: NotFoundErrorSwaggerType,
  })
  async sendPhoneNumberVerificationCode(@Param('phone_no') phone_no: string) {
    if (!phone_no) {
      throw new BadRequestException('Phone number is required');
    }

    return this.authService.sendPhoneNumberVerification(phone_no);
  }

  @Post('verify/phone/confirm')
  @ApiOkResponse({
    description: 'Phone number verified successfully',
    type: PhoneVerifiedSuccessful,
  })
  @ApiBadRequestResponse({ type: BadRequestErrorSwaggerType })
  @ApiNotFoundResponse({
    description: "User with the phone number doesn't eexists",
    type: NotFoundErrorSwaggerType,
  })
  async verifyPhoneNumber(@Body() data: PhoneNumberVerifyDto) {
    return this.authService.verifyPhoneNumber(
      data.phoneNo,
      data.verificationCode,
    );
  }
}
