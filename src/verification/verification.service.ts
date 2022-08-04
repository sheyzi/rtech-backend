import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

@Injectable()
export class VerificationService {
  private twilioClient: Twilio;

  constructor(private configService: ConfigService) {
    const accountSid = configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = configService.get<string>('TWILIO_AUTH_TOKEN');

    this.twilioClient = new Twilio(accountSid, authToken);
  }

  async initiatePhoneNumberVerification(phoneNumber: string) {
    const serviceSid = this.configService.get<string>(
      'TWILIO_VERIFICATION_SERVICE_SID',
    );

    return this.twilioClient.verify.services(serviceSid).verifications.create({
      to: phoneNumber,
      channel: 'sms',
    });
  }

  async initiateEmailVerification(email: string) {
    const serviceSid = this.configService.get<string>(
      'TWILIO_VERIFICATION_SERVICE_SID',
    );

    return this.twilioClient.verify.v2
      .services(serviceSid)
      .verifications.create({
        to: email,
        channel: 'email',
      });
  }

  async verifyPhoneNumber(
    phoneNumber: string,
    verificationCode: string,
  ): Promise<boolean> {
    try {
      const serviceSid = this.configService.get<string>(
        'TWILIO_VERIFICATION_SERVICE_SID',
      );

      const result = await this.twilioClient.verify.v2
        .services(serviceSid)
        .verificationChecks.create({ to: phoneNumber, code: verificationCode });

      const isValid =
        result.status === 'approved' &&
        result.valid === true &&
        result.to === phoneNumber;

      return isValid;
    } catch (e) {
      if (e.status === 404 && e.code === 20404) {
        return false;
      }
      throw e;
    }
  }

  async verifyEmail(email: string, verificationCode: string): Promise<boolean> {
    try {
      const serviceSid = this.configService.get<string>(
        'TWILIO_VERIFICATION_SERVICE_SID',
      );

      const result = await this.twilioClient.verify
        .services(serviceSid)
        .verificationChecks.create({ to: email, code: verificationCode });

      const isValid =
        result.status === 'approved' &&
        result.valid === true &&
        result.to === email;

      return isValid;
    } catch (e) {
      if (e.status === 404 && e.code === 20404) {
        return false;
      }
      throw e;
    }
  }
}
