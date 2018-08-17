import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { STUDENTS } from '../mocks/students';
import { IUser, UserRole } from '../interfaces';
import { FormBuilder, FormArray } from '@angular/forms';

const EMPTY_USER: IUser = {
  name: '',
  surname: '',
  login: '',
  password: '',
  isActive: true,
  phoneNumber: '',
  role: UserRole.STUDENT,
};

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss']
})
export class StudentsListComponent implements OnInit {
  students: IUser[] = [];
  displayedColumns: string[] = [
    'name',
    'surname',
    'login',
    // 'password',
    'phoneNumber',
    'isActive',
    'tools',
  ];
  form: FormArray;

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.userService
      .getStudents()
      .subscribe(
        students => this.students = students,
    );
  }

  addStudent() {
  }

  editStudent(studentId: string) {
  }

}
