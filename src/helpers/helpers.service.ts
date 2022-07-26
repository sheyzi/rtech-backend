import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';

@Injectable()
export class HelpersService {
  async hashPassword(password): Promise<string> {
    return argon.hash(password);
  }

  async verifyPassword(plainPassword, hashedPassword): Promise<boolean> {
    return argon.verify(hashedPassword, plainPassword);
  }
}
