import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';
import { MediaModule } from 'helper/media/media.module';
import { UserModule } from 'shared/user/user.module';
import { AccountModule } from '../account/account.module';

@Module({
  imports: [AccountModule, UserModule, MediaModule],
  controllers: [TransactionController],
  providers: [TransactionService, TransactionRepository],
})
export class TransactionModule {}
