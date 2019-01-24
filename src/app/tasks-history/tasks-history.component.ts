import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { TaskService } from '../services/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser, ITask, TopicName } from '../interfaces';
import { forkJoin } from 'rxjs';

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

  topicToString(topic: TopicName) {
    switch (topic) {
      case TopicName.SIMPLE:
        return 'просто';
      case TopicName.BROTHER:
        return 'брат';
      case TopicName.FRIEND:
        return 'друг';
      case TopicName.FRIEND_PLUS_BROTHER:
        return 'друг+брат';
      case TopicName.MULTIPLICATION:
        return 'умножение';
      case TopicName.DIVISION:
        return 'деление';
    }
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
