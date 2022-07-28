import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { HelpersService } from '../../helpers/helpers.service';
import { PrismaService } from '../../prisma/prisma.service';
import { SmsService } from '../../sms/sms.service';
import { UserCreateDto, UserUpdateDto } from '../dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private helpersService: HelpersService,
    private smsService: SmsService,
  ) {}

  async create(data: UserCreateDto, role: Role) {
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
      email: data.email,
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

  async getAll(where?: Prisma.UserWhereInput, limit = 100, skip = 0) {
    return this.prisma.user.findMany({
      where,
      take: limit,
      skip,
    });
  }

  async getOne(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({ where });
  }

  async update(
    where: Prisma.UserWhereUniqueInput,
    user: Prisma.UserUpdateInput,
  ) {
    const exists = await this.getOne(where);

    if (!exists) {
      throw new NotFoundException('User does not exist!');
    }
    return this.prisma.user.update({ where, data: { ...user } });
  }

  async delete(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<{ deleted: boolean; message?: string }> {
    const exists = await this.getOne(where);

    if (!exists) {
      throw new NotFoundException('User does not exist!');
    }
    await this.prisma.user.delete({ where });
    return { deleted: true };
  }
}
