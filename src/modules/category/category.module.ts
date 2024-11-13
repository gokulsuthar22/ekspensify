import { Module } from '@nestjs/common';
import { MediaModule } from 'src/helper/media/media.module';
import { CategoryService } from './category.service';
import { CategoryRepository } from './category.repository';
import { CategoryController } from './category.controller';
import { UserModule } from 'src/shared/user/user.module';

@Module({
  imports: [UserModule, MediaModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryRepository],
})
export class CategoryModule {}
