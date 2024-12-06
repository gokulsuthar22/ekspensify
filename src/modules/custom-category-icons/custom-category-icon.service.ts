import { HttpStatus, Injectable } from '@nestjs/common';
import { CustomCategoryIconRepository } from './custom-category-icon.repository';
import {
  CreateCustomCategoryIconData,
  FilterCustomCategoryIconWhere,
  UpdateCustomCategoryIconData,
} from './custom-category-icon.interface';
import { MediaRepository } from '@/helper/media/media.repository';
import { AppHttpException } from '@/core/exceptions/app-http.exception';

@Injectable()
export class CustomCategoryIconService {
  constructor(
    private mediaRepo: MediaRepository,
    private customCategoryIconRepo: CustomCategoryIconRepository,
  ) {}

  private async validateIcon(id: number) {
    const icon = await this.mediaRepo.findById(id);
    if (!icon) {
      throw new AppHttpException(
        HttpStatus.NOT_FOUND,
        `Icon does not exist by id ${id}`,
      );
    }
    if (icon.entityId) {
      throw new AppHttpException(
        HttpStatus.BAD_REQUEST,
        'Icon belongs to another category',
      );
    }
    return icon;
  }

  async create(data: CreateCustomCategoryIconData) {
    await this.validateIcon(data.iconId);
    const categoryIcon = await this.customCategoryIconRepo.create(data);
    return categoryIcon;
  }

  async update(id: number, data: UpdateCustomCategoryIconData) {
    const categoryIcon = await this.customCategoryIconRepo.findByIdAndUpdate(
      id,
      data,
    );
    if (!categoryIcon) {
      throw new AppHttpException(
        HttpStatus.NOT_FOUND,
        'Custom category icon not found',
      );
    }
    return categoryIcon;
  }

  async delete(id: number) {
    const categoryIcon =
      await this.customCategoryIconRepo.findByIdAndDelete(id);
    if (!categoryIcon) {
      throw new AppHttpException(
        HttpStatus.NOT_FOUND,
        'Custom category icon not found',
      );
    }
    return categoryIcon;
  }

  async findMany(where?: FilterCustomCategoryIconWhere) {
    const categoryIcons = await this.customCategoryIconRepo.findMany(where);
    return categoryIcons;
  }
}
