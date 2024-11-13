import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpRepository } from './otp.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [OtpService, OtpRepository],
  exports: [OtpService, OtpRepository],
})
export class OtpModule {}
