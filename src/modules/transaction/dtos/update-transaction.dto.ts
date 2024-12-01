import { Expose, Type } from 'class-transformer';

export class UpdateTransactionDto {
  @Expose()
  note: string;

  @Expose({ name: 'attachment_id' })
  @Type(() => Number)
  attachmentId: number;
}
