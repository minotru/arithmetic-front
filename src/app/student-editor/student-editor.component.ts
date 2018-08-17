import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  ) { }

  ngOnInit() {
    // this.activatedRoute.snapshot.
    this.form = this.fb.group({
      login: [''],
      password: [''],
      name: [''],
      surname: [''],
      phoneNumber: [''],
      isActive: [''],
    });
  }

}
