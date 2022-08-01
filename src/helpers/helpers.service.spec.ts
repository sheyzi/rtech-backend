import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { UsedToken } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { HelpersService } from './helpers.service';

const testTokenId = 'a_token_id';
const testUserId = 'shyet-10js';
const testJwtToken = 'some.test.jwt.token';

const usedTokenArray: UsedToken[] = [
  {
    id: testTokenId,
    expiresAt: new Date(),
  },
  {
    id: 'sheyzi',
    expiresAt: new Date(),
  },
];

const oneUsedToken = usedTokenArray[0];

describe('HelpersService', () => {
  let service: HelpersService;
  let prisma: PrismaService;
  let jwt: JwtService;

  const mockPrismaService = {
    usedToken: {
      findUnique: jest.fn().mockResolvedValue(usedTokenArray[0]),
      create: jest.fn().mockResolvedValue(oneUsedToken),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockResolvedValue(testJwtToken),
    verify: jest.fn().mockReturnValue({
      scope: 'refresh_token',
      userId: testUserId,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HelpersService,
        ConfigService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<HelpersService>(HelpersService);
    prisma = module.get<PrismaService>(PrismaService);
    jwt = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Password hashing', () => {
    it('should verify password successfully', async () => {
      const passwordHash = await service.hashPassword('password');

      await expect(
        service.verifyPassword('password', passwordHash),
      ).resolves.toEqual(true);
    });
    it('should fail password verification', async () => {
      const passwordHash = await service.hashPassword('password');

      await expect(
        service.verifyPassword('wrongPassword', passwordHash),
      ).resolves.toEqual(false);
    });
  });

  describe('Used tokens management', () => {
    it('should mark token as used', async () => {
      await expect(
        service.markTokenAsUsed(testTokenId, new Date()),
      ).resolves.toEqual(usedTokenArray[0]);
    });

    it('should return that token as been used', async () => {
      {
        await expect(service.isTokenUsed(testTokenId)).resolves.toEqual(true);
      }
    });

    it("should return that token haven't been used", async () => {
      jest.spyOn(prisma.usedToken, 'findUnique').mockResolvedValueOnce(null);

      await expect(service.isTokenUsed(testTokenId)).resolves.toEqual(false);
    });
  });

  describe('Token generation and validation', () => {
    it('should generate access token', async () => {
      await expect(service.generateAccessToken(testUserId)).resolves.toEqual(
        testJwtToken,
      );
    });

    it('should generate refresh token', async () => {
      await expect(service.generateRefreshToken(testUserId)).resolves.toEqual(
        testJwtToken,
      );
    });

    it('should verify refresh token successfully', async () => {
      jest.spyOn(prisma.usedToken, 'findUnique').mockResolvedValueOnce(null);

      await expect(
        service.decodeRefreshToken('refresh_token'),
      ).resolves.toEqual(testUserId);
    });

    it('should fail to verify refresh token because it has been used', async () => {
      await expect(service.decodeRefreshToken('refresh_token')).rejects.toThrow(
        'Invalid token',
      );
    });

    it('should fail to verify refresh token because the scope is invalid', async () => {
      jest.spyOn(jwt, 'verify').mockReturnValueOnce({
        scope: 'invalid_scope',
        userId: testUserId,
      });

      await expect(service.decodeRefreshToken('refresh_token')).rejects.toThrow(
        'Invalid token',
      );
    });
  });
});
