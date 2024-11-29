import { Module } from '@nestjs/common';
import { AwsS3Service } from './services/aws-s3.service';
import { ImageResizerService } from './services/Image-resizer.service';
import { MediaRepository } from './media.repository';

@Module({
  providers: [MediaRepository, AwsS3Service, ImageResizerService],
  exports: [MediaRepository, AwsS3Service],
})
export class MediaModule {}
