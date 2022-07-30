import { Role } from '@prisma/client';

export class User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNo: string;
  password: string;
  role: Role;
  isPhoneNoConfirmed: boolean;
  isEmailConfirmed: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
