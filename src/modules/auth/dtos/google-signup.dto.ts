import { Expose } from 'class-transformer';

export class GoogleSignUpDto {
  @Expose({ name: 'id_token' })
  idToken: string;
}
