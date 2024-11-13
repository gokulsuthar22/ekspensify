import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import {
  CreateCategoryData,
  FilterCategoryWhere,
  UpdateCategoryData,
  CategoryWhere,
} from './category.interface';

@Injectable()
export class CategoryService {
  constructor(private categoryRepo: CategoryRepository) {}

  async create(data: CreateCategoryData) {
    return this.categoryRepo.create(data);
  }

  async update(where: CategoryWhere, data: UpdateCategoryData) {
    const category = await this.categoryRepo.findOneAndUpdate(where, data);
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return category;
  }

  async delete(where: CategoryWhere) {
    const category = await this.categoryRepo.findOneAndDelete(where);
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return category;
  }

  async findMany(where?: FilterCategoryWhere) {
    return this.categoryRepo.findMany(where);
  }
}
