import { Expose } from 'class-transformer';

export class MediaDto {
  @Expose()
  small: string;

  @Expose()
  medium: string;

  @Expose()
  large: string;
}
