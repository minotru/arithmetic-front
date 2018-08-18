import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { STUDENTS } from '../mocks/students';
import { IUser, UserRole } from '../interfaces';
import { FormBuilder, FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { StudentEditorComponent } from '../student-editor/student-editor.component';

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
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.userService
      .getStudents()
      .subscribe(
        students => this.students = students,
    );
  }

  addStudent() {
    const dialogRef = this.dialog.open(StudentEditorComponent);
    dialogRef.afterClosed()
      .subscribe((user) => {
        if (user) {
          this.students.unshift(user);
          this.students = this.students.slice();
        }
      });
  }

  editStudent(student: IUser) {
    const dialogRef = this.dialog.open(
      StudentEditorComponent,
      { data: student },
    );
    dialogRef.afterClosed()
      .subscribe((user) => {
        if (user) {
          const ind = this.students.findIndex(u => u.id === user.id);
          this.students.splice(ind, 1, user);
          this.students = this.students.slice();
        }
      });
  }

}
