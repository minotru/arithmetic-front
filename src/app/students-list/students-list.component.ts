import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { STUDENTS } from '../mocks/students';
import { IUser } from '../interfaces';
import { FormBuilder, FormArray } from '@angular/forms';

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
          this.students = students;
          const controls = students.map(student => this.fb.group(student));
          controls.forEach(control => this.form.push(control));
        }
      );
  }

}
