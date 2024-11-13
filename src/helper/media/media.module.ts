import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { AwsS3Service } from './services/aws-s3.service';
import { ImageResizerService } from './services/Image-resizer.service';
import { MediaRepository } from './media.repository';

@Module({
  providers: [MediaService, MediaRepository, AwsS3Service, ImageResizerService],
  exports: [MediaService, MediaRepository],
})
export class MediaModule {}
