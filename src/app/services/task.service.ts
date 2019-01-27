import { Injectable } from '@angular/core';
import { ITask, ITaskConfig, IOperation } from '../interfaces';
import { TopicType, TopicName } from '../interfaces/task';
import { Observable, of, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ALL_TOPICS } from '../topics';

const ADMIN_TASKS = `${environment.apiUrl}/admin/tasks`;
const STUDENT_TASKS = `${environment.apiUrl}/student/tasks`;

const TASK_CONFIG_KEY = 'TASK_CONFIG';
const SHOW_PAST_OPERATIONS_KEY = 'SHOW_PAST_OPERATIONS';

function beTaskToTask(beTask: any): ITask {
  const feTask: ITask = Object.assign({}, beTask);
  if (beTask.date) {
    feTask.date = new Date(beTask.date);
  }
  return feTask;
}

export const EMPTY_TASK_CONFIG: ITaskConfig = {
  speed: null,
  topic: null,
  level: null,
  digitsCnt: null,
  operationsCnt: null,
  withRemainder: false,
};

@Injectable()
export class TaskService {
  taskConfig: ITaskConfig;
  showPastOperations: boolean;
  currentTask: ITask = null;

  constructor(private http: HttpClient) {
    const savedConfig = JSON.parse(localStorage.getItem(TASK_CONFIG_KEY));
    this.taskConfig = savedConfig || EMPTY_TASK_CONFIG;
    this.showPastOperations = JSON.parse(localStorage.getItem(SHOW_PAST_OPERATIONS_KEY)) || false;
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
    return this.http.post<{ task: ITask, operations: IOperation[] }>(
      `${STUDENT_TASKS}`,
      config,
    ).pipe(
      map(beTaskToTask),
    );
  }

  checkAnswer(taskId: string, isCorrect: boolean): Observable<void> {
    return this.http.post<void>(
      `${STUDENT_TASKS}/${taskId}`,
      { isCorrect },
    );
  }

  getTaskConfig(): ITaskConfig {
    return this.taskConfig;
  }

  setTaskConfig(taskConfig: ITaskConfig) {
    window.localStorage.setItem(TASK_CONFIG_KEY, JSON.stringify(taskConfig));
    this.taskConfig = taskConfig;
  }

  getShowPastOperations(): boolean {
    return this.showPastOperations;
  }

  toggleShowPastOperations(): void {
    this.showPastOperations = !this.showPastOperations;
    window.localStorage.setItem(SHOW_PAST_OPERATIONS_KEY, JSON.stringify(this.showPastOperations));
  }

  setCurrentTask(task: ITask) {
    this.currentTask = task;
  }

  getCurrentTask(): ITask {
    return this.currentTask;
  }

  getTopicType(topicName: TopicName): TopicType {
    const topic = ALL_TOPICS.find((_topic) => _topic.name === topicName);
    if (topic) {
      return topic.topicType;
    }
    return TopicType.PLUS_MINUS;
  }
}
