import { NgModule } from '@angular/core';
import { RouterModule, Router, Routes } from '@angular/router';
import { StudentPageComponent } from './student-page/student-page.component';
import { CanActivateService } from './services/can-activate.service';
import { LoginPageComponent } from './login-page/login-page.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { StudentsListComponent } from './students-list/students-list.component';
import { TaskEditorComponent } from './task-editor/task-editor.component';

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
  },
  {
    path: 'teacher',
    component: AdminPageComponent,
    children: [
       {
        path: '',
        redirectTo: 'students',
        pathMatch: 'full',
      },
      {
        path: 'students',
        component: StudentsListComponent,
      },
      {
        path: 'params',
        component: TaskEditorComponent,
      }
    ],
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