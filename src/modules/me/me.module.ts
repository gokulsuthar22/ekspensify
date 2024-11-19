import { Module } from '@nestjs/common';
import { MeService } from './me.service';
import { MeController } from './me.controller';
import { UserModule } from 'shared/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [MeController],
  providers: [MeService],
})
export class MeModule {}
