import { Expose, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTransactionDto {
  @Expose()
  @IsString({ message: '`note` must be a string' })
  note: string;

  @Expose({ name: 'attachment_id' })
  @IsNumber({}, { message: '`attachment_id` must be a number' })
  @Type(() => Number)
  @IsOptional()
  attachmentId: number;
}
