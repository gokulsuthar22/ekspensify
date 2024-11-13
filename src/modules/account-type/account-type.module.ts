import { Module } from '@nestjs/common';
import { AccountTypeController } from './account-type.controller';
import { AccountTypeRepository } from './account-type.repository';
import { UserModule } from 'src/shared/user/user.module';
import { AccountTypeService } from './account-type.service';

@Module({
  imports: [UserModule],
  controllers: [AccountTypeController],
  providers: [AccountTypeService, AccountTypeRepository],
})
export class AccountTypeModule {}
