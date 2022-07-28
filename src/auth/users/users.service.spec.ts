import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { v4 as uuid4 } from 'uuid';
import { HelpersService } from '../../helpers/helpers.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';
import { SmsService } from '../../sms/sms.service';

const userId = uuid4();
const testFirstName1 = 'John';
const testLastName1 = 'Doe';
const testEmail = 'johndoe@company.com';
const testPhoneNo = '+12345678910';
const testPassword = 'Password123!';

const usersArray = [
  {
    id: userId,
    firstName: testFirstName1,
    lastName: testLastName1,
    email: testEmail,
    phoneNo: testPhoneNo,
    password: testPassword,
    role: 'USER',
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
    role: 'USER',
    isPhoneNoConfirmed: false,
    isEmailConfirmed: false,
    isActive: true,
    createdAt: new Date('2021-02-02'),
    updatedAt: new Date('2021-02-03'),
  },

  {
    id: uuid4(),
    firstName: 'Samuel',
    lastName: 'Jones',
    email: 'samueljones@cpp.com',
    phoneNo: '+12345678912',
    password: 'Password123!',
    role: 'USER',
    isPhoneNoConfirmed: false,
    isEmailConfirmed: false,
    isActive: true,
    createdAt: new Date('2021-02-02'),
    updatedAt: new Date('2021-02-03'),
  },
];

const oneUser = usersArray[0];

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
      findMany: jest.fn().mockResolvedValue(usersArray),
      findUnique: jest.fn().mockResolvedValue(oneUser),
      findFirst: jest.fn().mockResolvedValue(oneUser),
      save: jest.fn(),
      create: jest.fn().mockResolvedValue(oneUser),
      update: jest.fn().mockResolvedValue(oneUser),
      delete: jest.fn().mockResolvedValue(oneUser),
    },
  };

  const mockSmsService = {
    initiatePhoneNumberVerification: jest.fn(),
    verifyPhoneNumber: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        HelpersService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: SmsService, useValue: mockSmsService },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      const result = await service.getAll();
      expect(result).toEqual(usersArray);
    });
  });

  describe('getOne', () => {
    it('should return one user', () => {
      expect(service.getOne(userId)).resolves.toEqual(oneUser);
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValueOnce(null);

      await expect(
        service.create(
          {
            firstName: testFirstName1,
            lastName: testLastName1,
            email: testEmail,
            phoneNo: testPhoneNo,
            password: testPassword,
            confirmPassword: testPassword,
          },
          Role.USER,
        ),
      ).resolves.toEqual(oneUser);
    });

    it('should throw an error if user already exists', async () => {
      await expect(
        service.create(
          {
            firstName: testFirstName1,
            lastName: testLastName1,
            email: testEmail,
            phoneNo: testPhoneNo,
            password: testPassword,
            confirmPassword: testPassword,
          },
          Role.USER,
        ),
      ).rejects.toThrow('User data already exists');
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      await expect(
        service.update(
          {
            id: userId,
          },
          {
            firstName: 'John',
            lastName: 'Doe',
          },
        ),
      ).resolves.toEqual(oneUser);
    });

    it('should throw an error if user does not exist', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);

      await expect(
        service.update(
          {
            id: userId,
          },
          {
            firstName: 'Samuel',
            lastName: 'Jones',
            email: 'samuellajones@hdj.com',
            phoneNo: '+12345678912',
          },
        ),
      ).rejects.toThrow('User does not exist!');
    });
  });

  describe('delete', () => {
    it('should delete a user', async () => {
      await expect(service.delete(userId)).resolves.toEqual({ deleted: true });
    });

    it('should throw an error if user does not exist', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce(null);

      await expect(service.delete(userId)).rejects.toThrow(
        'User does not exist!',
      );
    });
  });
});
