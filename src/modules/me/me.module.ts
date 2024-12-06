import { Module } from '@nestjs/common';
import { MeController } from './me.controller';
import { UserModule } from '@/shared/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [MeController],
})
export class MeModule {}
