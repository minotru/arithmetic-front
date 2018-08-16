import { NgModule } from '@angular/core';
import { RouterModule, Router, Routes } from '@angular/router';
import { StudentPageComponent } from './student-page/student-page.component';
import { CanActivateService } from './services/can-activate.service';
import { LoginPageComponent } from './login-page/login-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'student',
    component: StudentPageComponent,
  },
  {
    path: 'login',
    component: LoginPageComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule {
}
