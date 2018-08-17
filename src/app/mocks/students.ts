import { IUser, UserRole } from '../interfaces';

export const STUDENTS: IUser[] = [
  {
    id: '1',
    login: 'vasya',
    name: 'Вася',
    surname: 'Петров',
    phoneNumber: '+375291112233',
    role: UserRole.STUDENT,
    isActive: true,
    password: 'lol-kek',
  },
  {
    id: '2',
    login: 'petya',
    name: 'Петя',
    surname: 'Иванов',
    phoneNumber: '+375445712913',
    role: UserRole.STUDENT,
    isActive: true,
    password: 'abcdefg',
  },
  {
    id: '3',
    login: 'kostya',
    name: 'Костя',
    surname: 'Дмитров',
    phoneNumber: '+375444923409',
    role: UserRole.STUDENT,
    isActive: false,
    password: 'qwerty123'
  },
];
