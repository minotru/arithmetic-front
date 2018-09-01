import { Injectable } from '@angular/core';
import { ITask, ITaskConfig, IOperation } from '../interfaces';
import { Observable, of, from } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { OPERATIONS } from '../mocks/operations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

const ADMIN_TASKS = `${environment.apiUrl}/admin/tasks`;
const STUDENT_TASKS = `${environment.apiUrl}/student/tasks`;

function beTaskToTask(beTask: any): ITask {
  const feTask: ITask = Object.assign({}, beTask);
  if (beTask.date) {
    feTask.date = new Date(beTask.date);
  }
  return feTask;
}

@Injectable()
export class TaskService {
  constructor(private http: HttpClient) {
  }

  getTasksForUser(userId: string): Observable<ITask[]> {
    return this.http.get<ITask[]>(`${ADMIN_TASKS}/?userId=${userId}`)
      .pipe(
        map(tasks => tasks.map(task => beTaskToTask(task))),
      );
  }

  getTaskById(taskId: string): Observable<ITask> {
    return this.http.get<ITask>(`${ADMIN_TASKS}/tasks/${taskId}`)
      .pipe(
        map(task => beTaskToTask(task)),
      );
  }

  generateTask(config: ITaskConfig): Observable<ITask> {
    return this.http.post<{ task: ITask, operations: IOperation[]}>(
      `${STUDENT_TASKS}`,
      config,
    ).pipe(
      map((beTask) => {
        beTask.task.operations = beTask.operations;
        const date = beTask.task.date;
        beTask.task.date = date ? new Date(date) : null;
        return beTask.task;
      }),
    );
  }

  checkAnswer(taskId: string, userAnswer: number): Observable<ITask> {
    return this.http.post<ITask>(
      `${STUDENT_TASKS}/${taskId}`,
      { answer: userAnswer },
    ).pipe(
        map(task => beTaskToTask(task)),
      );
  }
}
