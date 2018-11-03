import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { UserRole } from '../interfaces';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
  ) { }

  ngOnInit() {
    if (this.userService.isAuthorized()) {
      if (this.userService.getUser().role === UserRole.ADMIN) {
        return this.router.navigate(['/teacher']);
      }
      if (this.userService.getUser().role === UserRole.STUDENT) {
        return this.router.navigate(['/student']);
      }
    }
    this.form = this.fb.group({
      login: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    const { login, password } = this.form.value;
    this.userService.login(login, password)
      .subscribe(
        (user) => {
          if (user.role === UserRole.STUDENT) {
            return this.router.navigate(['/student']);
          }
          this.router.navigate(['/teacher']);
        },
        (err) => {
          const errorName = err.error;
          this.form.setErrors({
            [errorName]: true
          });
        },
      );
  }
}
