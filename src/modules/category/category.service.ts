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

@Injectable()
export class CategoryService {
  constructor(
    private categoryRepo: CategoryRepository,
    private mediaRepo: MediaRepository,
    private awsS3Service: AwsS3Service,
  ) {}

  async create(data: CreateCategoryData) {
    const category = await this.categoryRepo.create(data);
    await this.mediaRepo.findByIdAndUpdate(category.iconId, {
      modelId: category.id,
      modelType: 'CATEGORY',
    });
    return category;
  }

  async update(where: CategoryWhere, data: UpdateCategoryData) {
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
    const key = `categories/${data.icon.originalname}_${Date.now()}.png`;
    const path = this.awsS3Service.getObjectUrl(key);
    const [icon] = await Promise.all([
      this.mediaRepo.create({
        collection: 'CATEGORY',
        name: data.icon.originalname,
        key: key,
        mime: data.icon.mimetype,
        path: path,
        size: data.icon.size,
        type: 'IMAGE',
        userId: data.userId,
      }),
      this.awsS3Service.upload(data.icon.buffer, key, data.icon.mimetype),
    ]);
    return icon;
  }
}
