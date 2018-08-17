import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { STUDENTS } from '../mocks/students';
import { IUser, UserRole } from '../interfaces';
import { FormBuilder, FormArray } from '@angular/forms';

interface RowData {
  student: IUser;
  isEditing: boolean;
}

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
  data: RowData[] = [];
  displayedColumns: string[] = [
    'name',
    'surname',
    'login',
    'password',
    'phoneNumber',
    'isActive',
    'tools',
  ];
  form: FormArray;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.form = this.fb.array([]);
    this.userService
      .getStudents()
      .subscribe(
        (students) => {
          this.data = students.map(student => ({
            student,
            isEditing: false,
          }));
        this.data[0].isEditing = true;
        }
      );
  }

  deleteStudent(index: number) {
    if (window.confirm('Вы уверены?')) {
      this.data.splice(index, 1);
      this.data = this.data.slice();
    }
  }

  addStudent() {
    this.data.unshift({
      isEditing: true,
      student: Object.assign({}, EMPTY_USER),
    });
    this.data = this.data.slice();
  }

  editStudent(index: number) {
    this.data[index].isEditing = true;
    this.data = this.data.slice();
  }

}
