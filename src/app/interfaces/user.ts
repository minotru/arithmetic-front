export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
}

export interface IUser {
  id?: string;
  login: string;
  password?: string;
  role: UserRole;
  name: string;
  surname: string;
  isActive: boolean;
  phoneNumber: string;
}
