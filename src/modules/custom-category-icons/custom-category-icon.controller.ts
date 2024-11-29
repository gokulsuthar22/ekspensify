import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CustomCategoryIconService } from './custom-category-icon.service';
import { AuthGuard } from 'core/guards/auth.guard';
import { RoleGuard } from 'core/guards/role.guard';
import { Roles } from 'core/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Serialize } from 'core/interceptors/serialize.interceptor';
import { CreateCustomCategoryIconDto } from './dtos/create-custom-category-icon.dto';
import { MediaDto } from 'helper/media/dtos/media.dto';

@Controller('categories/custom-icons')
@UseGuards(AuthGuard, RoleGuard)
export class CustomCategoryIconController {
  constructor(private customIconService: CustomCategoryIconService) {}

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(MediaDto)
  async findMany() {
    const categoryIcons = await this.customIconService.findMany();
    return categoryIcons.map((c) => c.icon);
  }

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async create(@Body() data: CreateCustomCategoryIconDto) {
    await this.customIconService.create(data);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number) {
    await this.customIconService.delete(id);
  }
}
