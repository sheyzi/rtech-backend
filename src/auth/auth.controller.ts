import {
  Body,
  Controller,
  DefaultValuePipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { EnumValidationPipe } from '../pipes/enum.pipe';
import { CreateUserDto } from './dto/users.dto';
import { UsersService } from './users/users.service';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private usersService: UsersService) {}

  // TODO: Implement email and phone number verification
  // TODO: Implement reset password mail sending and reset password confirmation
  // TODO: Implement login and refresh token

  @Post('signup')
  @ApiCreatedResponse({
    description: 'User has been successfully created',
  })
  @ApiBadRequestResponse({ description: 'Request body is invalid' })
  @ApiQuery({ name: 'role', enum: Role })
  async signup(
    @Body() data: CreateUserDto,
    @Query(
      'role',
      new EnumValidationPipe(Role),
      new DefaultValuePipe(Role.USER),
    )
    role: Role,
  ) {
    return this.usersService.createUser(data, role);
  }
}
