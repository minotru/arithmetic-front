import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { StudentPageComponent } from './student-page/student-page.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorInterceptor } from './error-interceptor';
import { UserService } from './services/user.service';
import { TaskService } from './services/task.service';

@NgModule({
  declarations: [
    AppComponent,
    StudentPageComponent,
  ],
  imports: [
    BrowserModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    UserService,
    TaskService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
