import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { TaskService } from '../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser, ITask, TopicName, TopicType } from '../interfaces';
import { ALL_TOPICS } from '../topics';

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
    this.userService
      .getUserById(studentId)
      .subscribe(student => this.student = student);
    this.taskService
      .getTasksForUser(studentId)
      .subscribe(tasks => {
        this.tasks = tasks;
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
