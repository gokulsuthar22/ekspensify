import { Module } from '@nestjs/common';
import { CustomCategoryIconRepository } from './custom-category-icon.repository';
import { CustomCategoryIconService } from './custom-category-icon.service';
import { CustomCategoryIconController } from './custom-category-icon.controller';
import { UserModule } from 'shared/user/user.module';
import { MediaModule } from 'helper/media/media.module';

@Module({
  imports: [UserModule, MediaModule],
  controllers: [CustomCategoryIconController],
  providers: [CustomCategoryIconService, CustomCategoryIconRepository],
  exports: [CustomCategoryIconRepository],
})
export class CustomCategoryIconModule {}
