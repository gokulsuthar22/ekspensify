import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dtos/category.dto';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateCategoryDto } from './dtos/update.dto';
import { FilterCategoryDto } from './dtos/filter-category.dto';

@Controller('categories')
@UseGuards(AuthGuard, RoleGuard)
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Post()
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.CREATED)
  @Serialize(CategoryDto)
  create(@CurrentUser() user: any, @Body() data: CreateCategoryDto) {
    return this.categoryService.create({
      name: data.name,
      userId: user.role !== 'ADMIN' ? user.id : null,
    });
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Serialize(CategoryDto)
  update(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() data: UpdateCategoryDto,
  ) {
    return this.categoryService.update(
      {
        id,
        userId: user.role !== 'ADMIN' ? user.id : null,
      },
      data,
    );
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(CategoryDto)
  delete(@CurrentUser() user: any, @Param('id') id: string) {
    return this.categoryService.delete({
      id,
      userId: user.role !== 'ADMIN' ? user.id : null,
    });
  }

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(CategoryDto)
  findMany(@CurrentUser() user: any, @Query() where: FilterCategoryDto) {
    return this.categoryService.findMany({
      ...where,
      OR:
        user.role !== 'ADMIN'
          ? [{ userId: null }, { userId: user.id }]
          : [{ userId: null }],
    });
  }
}
