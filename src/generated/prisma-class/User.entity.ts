import { Role } from '@prisma/client';

export class User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: Role;
  isPhoneNumberConfirmed: boolean;
  isEmailConfirmed: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
