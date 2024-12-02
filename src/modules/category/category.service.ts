import { HttpStatus, Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import {
  CreateCategoryData,
  FilterCategoryWhere,
  UpdateCategoryData,
  CategoryWhere,
  UploadIconData,
} from './category.interface';
import { AppHttpException } from 'core/exceptions/http.exception';
import { MediaRepository } from 'helper/media/media.repository';
import { AwsS3Service } from 'helper/media/services/aws-s3.service';
import { CustomCategoryIconRepository } from 'modules/custom-category-icons/custom-category-icon.repository';

@Injectable()
export class CategoryService {
  constructor(
    private categoryRepo: CategoryRepository,
    private mediaRepo: MediaRepository,
    private customCategoryIconRepo: CustomCategoryIconRepository,
    private awsS3Service: AwsS3Service,
  ) {}

  private async validateIcon(id: number) {
    const icon = await this.mediaRepo.findById(id);
    if (!icon) {
      throw new AppHttpException(
        HttpStatus.NOT_FOUND,
        `Icon not found`,
        'ICON_NOT_FOUND',
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

  private async isCustomIcon(id: number) {
    const isCustomIcon = await this.customCategoryIconRepo.findOne({
      iconId: id,
      isActive: true,
    });
    if (!isCustomIcon) {
      throw new AppHttpException(
        HttpStatus.NOT_FOUND,
        `Custom Icon not found`,
        'CUSTOM_CATEGORY_ICON_NOT_FOUND',
      );
    }
    return isCustomIcon ? true : false;
  }

  async create(data: CreateCategoryData) {
    const icon = await this.validateIcon(data.iconId);
    const category = await this.categoryRepo.create(data);
    const isCustomIcon = await this.isCustomIcon(icon.id);
    if (!isCustomIcon) {
      await this.mediaRepo.findByIdAndUpdate(icon.id, {
        entityId: data.iconId,
        entityType: 'category',
      });
    }
    return category;
  }

  async update(where: CategoryWhere, data: UpdateCategoryData) {
    if (!data.iconId) {
      delete data?.iconId;
    }
    if (data.iconId) {
      const icon = await this.validateIcon(data.iconId);
      const isCustomIcon = await this.isCustomIcon(icon.id);
      if (!isCustomIcon) {
        await this.mediaRepo.findByIdAndUpdate(icon.id, {
          entityId: where.id,
          entityType: 'category',
        });
      }
    }
    const category = await this.categoryRepo.findOneAndUpdate(where, data);
    if (!category) {
      throw new AppHttpException(
        HttpStatus.NOT_FOUND,
        'Category does not exist',
      );
    }
    return category;
  }

  async delete(where: CategoryWhere) {
    const category = await this.categoryRepo.findOneAndDelete(where);
    if (!category) {
      throw new AppHttpException(
        HttpStatus.NOT_FOUND,
        'Category does not exist',
      );
    }
    return category;
  }

  async findMany(where?: FilterCategoryWhere) {
    const categories = await this.categoryRepo.findMany(where);
    return categories;
  }

  async uploadIcon(data: UploadIconData) {
    const name = this.awsS3Service.getObjectKey(
      data.icon.originalname,
      'png',
      'categories',
    );
    const path = this.awsS3Service.getObjectUrl(name);
    const [icon] = await Promise.all([
      this.mediaRepo.create({
        name: data.icon.originalname,
        path: path,
        size: data.icon.size,
        mime: data.icon.mimetype,
        userId: data.userId,
      }),
      this.awsS3Service.upload(data.icon.buffer, name, data.icon.mimetype),
    ]);
    return icon;
  }
}
