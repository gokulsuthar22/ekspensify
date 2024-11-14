import { Injectable } from '@nestjs/common';
import { OtpMailPaylaod } from './mail.interface';

@Injectable()
export class MailTemplateFactory {
  otpMail(email: string, paylaod: OtpMailPaylaod) {
    return {
      to: email,
      subject: 'Requested OTP',
      template: 'otp-mail',
      context: {
        code: paylaod.code,
        username: paylaod.username,
      },
    };
  }
}
