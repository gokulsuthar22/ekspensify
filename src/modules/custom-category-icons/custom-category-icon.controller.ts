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
  UseGuards,
} from '@nestjs/common';
import { CustomCategoryIconService } from './custom-category-icon.service';
import { AuthGuard } from 'core/guards/auth.guard';
import { RoleGuard } from 'core/guards/role.guard';
import { Roles } from 'core/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { Serialize } from 'core/interceptors/serialize.interceptor';
import { CustomCategoryIconDto } from './dtos/custom-category-icon.dto';
import { CreateCustomCategoryIconDto } from './dtos/create-custom-category-icon.dto';
import { UpdateCustomCategoryIconDto } from './dtos/update-custom-category-icon.dto';
import { ExtentedParseIntPipe } from 'core/pipes/extended-parse-int.pipe';
import { CurrentUser } from 'core/decorators/current-user.decorator';

@Controller('categories/custom-icons')
@UseGuards(AuthGuard, RoleGuard)
export class CustomCategoryIconController {
  constructor(private customIconService: CustomCategoryIconService) {}

  @Get()
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.OK)
  @Serialize(CustomCategoryIconDto)
  findMany(@CurrentUser() user: any) {
    return this.customIconService.findMany({
      isActive: user.role !== 'ADMIN' ? true : undefined,
    });
  }

  @Post()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Serialize(CustomCategoryIconDto)
  create(@Body() data: CreateCustomCategoryIconDto) {
    return this.customIconService.create(data);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Serialize(CustomCategoryIconDto)
  update(
    @Param('id', ExtentedParseIntPipe) id: number,
    @Body() data: UpdateCustomCategoryIconDto,
  ) {
    return this.customIconService.update(id, data);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @Serialize(CustomCategoryIconDto)
  delete(@Param('id', ExtentedParseIntPipe) id: number) {
    return this.customIconService.delete(id);
  }
}
