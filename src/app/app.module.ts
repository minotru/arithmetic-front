import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { StudentPageComponent } from './student-page/student-page.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorInterceptor } from './error-interceptor';
import { UserService } from './services/user.service';
import { TaskService } from './services/task.service';
import { SpeechSynthesisService } from './services/speech-synthesis.service';
import { HeaderComponent } from './header/header.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AppRoutingModule } from './app-routing.module';
import { CanActivateService } from './services/can-activate.service';
import { FooterComponent } from './footer/footer.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { StudentsListComponent } from './students-list/students-list.component';
import { StudentEditorComponent } from './student-editor/student-editor.component';

import {
  MatCheckboxModule,
  MatInputModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatButtonModule,
  MatTableModule,
  MatDialogModule,
  MatDividerModule,
  MatCardModule,
  MatListModule,
  MatSelectModule,
  MatChipsModule,
  MatProgressSpinnerModule,
} from '@angular/material';
import { HeadersInterceptor } from './headers-interceptor';
import { TasksHistoryComponent } from './tasks-history/tasks-history.component';
import { MapService } from './services/map.service';
import { TaskConfigComponent } from './student-page/task-config/task-config.component';
import { TaskRunnerComponent } from './student-page/task-runner/task-runner.component';

@NgModule({
  declarations: [
    AppComponent,
    StudentPageComponent,
    HeaderComponent,
    LoginPageComponent,
    FooterComponent,
    AdminPageComponent,
    StudentsListComponent,
    StudentEditorComponent,
    TasksHistoryComponent,
    TaskConfigComponent,
    TaskRunnerComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatCardModule,
    MatListModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    UserService,
    TaskService,
    MapService,
    CanActivateService,
    SpeechSynthesisService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeadersInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
