import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { TaskService } from '../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser, ITask, TopicName, TopicType } from '../interfaces';
import { ALL_TOPICS } from '../topics';
import { forkJoin } from 'rxjs';

const formatMap = ALL_TOPICS.reduce((acc, topic) => {
  acc[topic.name] = {
    topicCaption: topic.caption,
    levelsCaption: topic.levels.reduce((acc1, level) => {
      acc1[level] = topic.formatLevel(level);
      return acc1;
    }, {}),
  };
  return acc;
}, {});

@Component({
  selector: 'app-tasks-history',
  templateUrl: './tasks-history.component.html',
  styleUrls: ['./tasks-history.component.scss']
})
export class TasksHistoryComponent implements OnInit {
  student: IUser = null;
  tasks: ITask[] = [];
  isLoading: boolean;

  displayedColumns: string[] = [
    'date',
    'topic',
    'level',
    'digitsCnt',
    'operationsCnt',
    'speed',
    'isCorrect',
  ];

  constructor(
    private userService: UserService,
    private taskService: TaskService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    const studentId = this.activatedRoute.snapshot.params['studentId'];
    const userRequest = this.userService.getUserById(studentId);
    const tasksRequest = this.taskService.getTasksForUser(studentId);
    this.isLoading = true;
    forkJoin(userRequest, tasksRequest).subscribe((res) => {
      this.student = res[0];
      this.tasks = res[1];
      this.isLoading = false;
    });
  }

  formatTopic(task: ITask): string {
    return formatMap[task.config.topic].topicCaption;
  }

  formatLevel(task: ITask): string {
    return formatMap[task.config.topic].levelsCaption[task.config.level];
  }

  get studentFullName() {
    if (!this.student) {
      return '';
    }
    return `${this.student.name} ${this.student.surname}`;
  }

  goBack() {
    this.router.navigate(['../../'], { relativeTo: this.activatedRoute });
  }

}
