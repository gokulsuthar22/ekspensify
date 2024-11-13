import { Expose } from 'class-transformer';

export class GoogleSignInDto {
  @Expose({ name: 'id_token' })
  idToken: string;
}
