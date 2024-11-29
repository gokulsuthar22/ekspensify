import { HttpStatus, Injectable } from '@nestjs/common';
import { CustomCategoryIconRepository } from './custom-category-icon.repository';
import {
  CreateCustomCategoryIconData,
  FilterCustomCategoryIconWhere,
} from './custom-category-icon.interface';
import { MediaRepository } from 'helper/media/media.repository';
import { AppHttpException } from 'core/exceptions/http.exception';

@Injectable()
export class CustomCategoryIconService {
  constructor(
    private mediaRepo: MediaRepository,
    private customCategoryIconRepo: CustomCategoryIconRepository,
  ) {}

  async create(data: CreateCustomCategoryIconData) {
    const icon = await this.mediaRepo.findById(data.iconId);
    if (!icon) {
      throw new AppHttpException(HttpStatus.NOT_FOUND, 'icon not found');
    }
    if (icon.modelId) {
      throw new AppHttpException(
        HttpStatus.BAD_REQUEST,
        'icon is already attched to other category',
      );
    }
    const categoryIcon = await this.customCategoryIconRepo.create(data);
    return categoryIcon;
  }

  async delete(id: number) {
    const categoryIcon =
      await this.customCategoryIconRepo.findByIdAndDelete(id);
    return categoryIcon;
  }

  async findMany(where?: FilterCustomCategoryIconWhere) {
    const categoryIcons = await this.customCategoryIconRepo.findMany(where);
    return categoryIcons;
  }
}
