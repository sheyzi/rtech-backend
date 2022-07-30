import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { v4 as uuid4 } from 'uuid';
import { Prisma, Role } from '@prisma/client';
import { UserCreateDto, UserUpdateDto } from './dto/users.dto';

const userId = uuid4();
const testFirstName1 = 'John';
const testLastName1 = 'Doe';
const testEmail = 'johndoe@company.com';
const testPhoneNo = '+12345678910';
const testPassword = 'Password123!';

const mockPrismaService = {
  getAll: jest.fn().mockResolvedValue([
    {
      id: userId,
      firstName: testFirstName1,
      lastName: testLastName1,
      email: testEmail,
      phoneNo: testPhoneNo,
      password: testPassword,
      role: Role.USER,
      isPhoneNoConfirmed: true,
      isEmailConfirmed: true,
      isActive: true,
      createdAt: new Date('2021-01-01'),
      updatedAt: new Date('2021-01-01'),
    },
    {
      id: uuid4(),
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'janedoe@company.com',
      phoneNo: '+12345678911',
      password: 'Password123!',
      role: Role.USER,
      isPhoneNoConfirmed: false,
      isEmailConfirmed: false,
      isActive: true,
      createdAt: new Date('2021-02-02'),
      updatedAt: new Date('2021-02-03'),
    },
  ]),
  getOne: jest.fn().mockResolvedValue({
    id: userId,
    firstName: testFirstName1,
    lastName: testLastName1,
    email: testEmail,
    phoneNo: testPhoneNo,
    password: testPassword,
    role: Role.USER,
    isPhoneNoConfirmed: true,
    isEmailConfirmed: true,
    isActive: true,
    createdAt: new Date('2021-01-01'),
    updatedAt: new Date('2021-01-01'),
  }),
  create: jest.fn().mockImplementation((data: UserCreateDto, role: Role) =>
    Promise.resolve({
      id: userId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNo: data.phoneNumber,
      password: data.password,
      role,
      isPhoneNoConfirmed: false,
      isEmailConfirmed: false,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  ),
  update: jest
    .fn()
    .mockImplementation(
      (where: Prisma.UserWhereUniqueInput, data: UserUpdateDto) =>
        Promise.resolve({
          id: userId,
          firstName: data.firstName ?? testFirstName1,
          lastName: data.lastName ?? testLastName1,
          email: data.email ?? testEmail,
          phoneNo: data.phoneNumber ?? testPhoneNo,
          password: testPassword,
          role: Role.USER,
          isPhoneNoConfirmed: false,
          isEmailConfirmed: false,
          isActive: true,
        }),
    ),
  delete: jest.fn().mockResolvedValue({ deleted: true }),
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
