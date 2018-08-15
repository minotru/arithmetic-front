import { Injectable } from '@angular/core';
import { ITask, ITaskConfig } from '../interfaces';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { OPERATIONS } from '../mocks/operations';

@Injectable()
export class TaskService {
  currentTask: ITask;

  constructor() {
    this.currentTask = null;
  }

  generateTask(config: ITaskConfig): Observable<ITask> {
    const mockTask: ITask = {
      config,
      id: 'exampleId',
      userId: 'exampleUserId',
      operations: [...OPERATIONS, ...OPERATIONS],
    };
    return of(mockTask).pipe(
      tap(task => this.currentTask = task)
    );
  }

  checkAnswer(userAnswer: number): Observable<ITask> {
    return of({
      ...this.currentTask,
      answer: 42,
      isCorrect: 42 === userAnswer,
    }).pipe(
      tap(task => this.currentTask = task),
    );
  }
}
