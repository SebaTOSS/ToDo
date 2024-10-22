import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Expose()
  createdAt: Date;

  @Expose()
  lastLogin: Date;

  @Expose()
  firstLogin: Date;

  @Expose()
  isActive: boolean;
}