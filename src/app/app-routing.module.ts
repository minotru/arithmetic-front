import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentPageComponent } from './student-page/student-page.component';
import { CanActivateService } from './services/can-activate.service';
import { LoginPageComponent } from './login-page/login-page.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { StudentsListComponent } from './students-list/students-list.component';
import { StudentEditorComponent } from './student-editor/student-editor.component';
import { TasksHistoryComponent } from './tasks-history/tasks-history.component';
import { TaskConfigComponent } from './student-page/task-config/task-config.component';
import { TaskRunnerComponent } from './student-page/task-runner/task-runner.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'student',
    component: StudentPageComponent,
    children: [
      {
        path: '',
        redirectTo: 'task-config',
        pathMatch: 'full'
      },
      {
        path: 'task-config',
        component: TaskConfigComponent
      },
      {
        path: 'task-runner',
        component: TaskRunnerComponent,
      }
    ],
    canActivate: [CanActivateService],
  },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'teacher',
    component: AdminPageComponent,
    canActivate: [CanActivateService],
    children: [
       {
        path: '',
        redirectTo: 'students',
        pathMatch: 'full',
      },
      {
        path: 'students',
        children: [
          {
            path: 'edit',
            component: StudentEditorComponent,
          },
          {
            path: 'list',
            component: StudentsListComponent,
          },
          {
            path: '',
            redirectTo: 'list',
            pathMatch: 'full',
          },
        ],
      },
      {
        path: 'history/:studentId',
        component: TasksHistoryComponent,
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
