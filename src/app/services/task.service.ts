import { Injectable } from '@angular/core';
import { ITask, ITaskConfig, IOperation } from '../interfaces';
import { Observable, of, from } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { OPERATIONS } from '../mocks/operations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';


const ADMIN_TASKS = `${environment.apiUrl}/admin/tasks`;
const STUDENT_TASKS = `${environment.apiUrl}/student/tasks`;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  withCredentials: true,
};

// export interface GenerateTaskDto {
//   operations: IOperation[];
//   id: string;
// }

// export interface CheckTaskDto {
//   answer: number;
//   isCorrect: boolean;
// }

@Injectable()
export class TaskService {
  constructor(private http: HttpClient) {
  }

  getTasksForUser(userId: string): Observable<ITask[]> {
    return this.http.get<ITask[]>(`${ADMIN_TASKS}/?userId=${userId}`);
  }

  getTaskById(taskId: string): Observable<ITask> {
    return this.http.get<ITask>(`${ADMIN_TASKS}/tasks/${taskId}`);
  }

  generateTask(config: ITaskConfig): Observable<ITask> {
    // const mockTask: ITask = {
    //   config,
    //   id: 'exampleId',
    //   userId: 'exampleUserId',
    //   operations: [...OPERATIONS, ...OPERATIONS],
    // };
    // return of(mockTask);

    return this.http.post<{ task: ITask, operations: IOperation[]}>(
      `${STUDENT_TASKS}`,
      config,
      httpOptions,
    ).pipe(
      map((beTask) => {
        beTask.task.operations = beTask.operations;
        return beTask.task;
      }),
    );
  }

  checkAnswer(taskId: string, userAnswer: number): Observable<ITask> {
    return this.http.post<ITask>(
      `${STUDENT_TASKS}/${taskId}`,
      { answer: userAnswer },
      httpOptions,
    );
    // return of({
    //   ...this.currentTask,
    //   answer: 42,
    //   isCorrect: 42 === userAnswer,
    // }).pipe(
    //   tap(task => this.currentTask = task),
    // );
  }
}
