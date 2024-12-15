import { Module } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BudgetRepository } from './budget.repository';
import { BudgetController } from './budget.controller';
import { UserModule } from '@/shared/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [BudgetController],
  providers: [BudgetService, BudgetRepository],
})
export class BudgetModule {}
