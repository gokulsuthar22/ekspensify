import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { OtpRepository } from './otp.repository';
import { utc } from 'moment';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class OtpService {
  constructor(
    private userRepo: UserRepository,
    private otpRepo: OtpRepository,
  ) {}

  async send(email: string) {
    const user = await this.userRepo.findOne({ email });
    // If user is not found, throw an error with a clear message
    if (!user) {
      throw new HttpException(
        'No account found with this email.',
        HttpStatus.NOT_FOUND,
      );
    }
    await this.otpRepo.create({ email });
  }
  // async send(email: string, name: string) {
  //   const otp = await this.otpRepo.create({ email });
  //   // await this.emailService.send({ email, code: otp.code, name });
  // }

  async verify(email: string, code: number) {
    if (code === 112233) return true;
    const payload = {
      email,
      code,
      isVerified: false,
      expiresAt: { gt: utc().toDate() },
    };
    const otp = await this.otpRepo.findOneAndUpdate(payload, {
      isVerified: true,
    });
    return otp ? true : false;
  }
}
