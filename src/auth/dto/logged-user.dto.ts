export class LoggedUserDto {
  id: number;
  email: string;

  constructor(id: number, email: string) {
    this.id = id;
    this.email = email;
  }
}