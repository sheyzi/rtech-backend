import { BadRequestException, Injectable } from '@nestjs/common';
import { Role } from '@prisma/client';
import { HelpersService } from '../../helpers/helpers.service';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from '../dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private helpersService: HelpersService,
  ) {}

  async createUser(data: CreateUserDto, role: Role) {
    // Check if user already exists
    const oldUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ email: data.email }, { phoneNo: data.phoneNo }],
      },
    });

    if (oldUser) {
      throw new BadRequestException('User data already exists');
    }

    // Hash password
    const password = await this.helpersService.hashPassword(data.password);

    const userData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.password,
      phoneNo: data.phoneNo,
      password,
      role,
    };

    const user = await this.prisma.user.create({
      data: { ...userData },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNo: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }
}
