import { Component, OnInit, Inject } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { IUser, UserRole } from '../interfaces';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-student-editor',
  templateUrl: './student-editor.component.html',
  styleUrls: ['./student-editor.component.scss']
})
export class StudentEditorComponent implements OnInit {
  form: FormGroup;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<StudentEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public studentToEdit: IUser,
  ) { }

  ngOnInit() {
    // this.activatedRoute.snapshot.
    this.form = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
      name: ['',  Validators.required],
      surname: ['',  Validators.required],
      phoneNumber: [''],
      isActive: [''],
    });
    if (this.studentToEdit) {
      const editFields = Object.assign({}, this.studentToEdit);
      delete editFields.id;
      delete editFields.role;
      this.form.patchValue(editFields);
    }
  }

  onSave() {
    const forSave = this.form.value;
    forSave.role = UserRole.STUDENT;
    let request: Observable<IUser>;
    if (this.studentToEdit) {
      const studentId = this.studentToEdit.id;
      forSave.id = studentId;
      request = this.userService.editUser(studentId, forSave);
    } else {
      request = this.userService.createUser(forSave);
    }
    request.subscribe((user) => this.dialogRef.close(user));
  }

  onClose() {
    this.dialogRef.close();
  }

  // onDelete() {
  //   const res = window.confirm('Вы уверены?\nЭто действие нельзя отменить!');
  //   if (res) {
  //     this.userService.deleteUser(this.studentToEdit.id);
  //   }
  // }
}
