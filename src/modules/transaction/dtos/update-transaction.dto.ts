import { Expose } from 'class-transformer';

export class UpdateTransactionDto {
  @Expose()
  note: string;
}
