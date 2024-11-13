import { Injectable } from '@nestjs/common';
import { AwsS3Service } from './services/aws-s3.service';
import { ImageResizerService } from './services/Image-resizer.service';
import { MediaRepository } from './media.repository';

@Injectable()
export class MediaService {
  constructor(
    private mediaRepo: MediaRepository,
    private awsS3Service: AwsS3Service,
    private imageResizerService: ImageResizerService,
  ) {}

  async uploadImage(file: Buffer) {
    const name = Date.now().toString();
    const images = await this.imageResizerService.resize(file, name);
    const [smallUrl, mediumUrl, largeUrl] = await Promise.all(
      Object.values(images).map((img) => {
        return this.awsS3Service.upload(img.buffer, img.name, 'image/png');
      }),
    );
    return this.mediaRepo.create({
      name,
      path: largeUrl,
      type: 'IMAGE',
      small: smallUrl,
      medium: mediumUrl,
      large: largeUrl,
    });
  }
}
