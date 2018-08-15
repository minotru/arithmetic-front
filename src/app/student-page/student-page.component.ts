import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TopicName, IOperation, OperationType, ITaskConfig } from '../interfaces/task';
import { UserService } from '../services/user.service';
import { OPERATIONS } from '../mocks/operations';

interface ITopic {
  name: string;
  caption: string;
  levels: string[];
}

const SPEED_VALUES: number[] = [
  7, 6, 5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.7,
];

enum AppState {
  CONFIG = 'config',
  RUNNING = 'running',
  ENTER_ANSWER = 'enter_answer',
}

const TOPICS: ITopic[] = [
  {
    name: TopicName.SIMPLE,
    caption: 'ПРОСТО',
    levels: ['2', '3', '4', '5', '6', '7', '8', '9'],
  },
  {
    name: TopicName.BROTHER,
    caption: 'БРАТ',
    levels: ['4', '3', '2', '1'],
  },
  {
    name: TopicName.FRIEND,
    caption: 'ДРУГ',
    levels: ['9', '8', '7', '6', '5', '4', '3', '2', '1'],
  },
  {
    name: TopicName.FRIEND_AND_BROTHER,
    caption: 'ДРУГ+БРАТ',
    levels: ['6', '7', '8', '9'],
  },
];

@Component({
  selector: 'app-student-page',
  templateUrl: './student-page.component.html',
  styleUrls: ['./student-page.component.scss']
})
export class StudentPageComponent implements OnInit {
  topics: ITopic[] = TOPICS;
  taskConfig: ITaskConfig = { digitsCnt: 2, speed: 0.1 } as ITaskConfig;
  speedValues: number[] = SPEED_VALUES;
  configForm: FormGroup;
  readonly operations = [...OPERATIONS];
  currentOperationIndex = 0;
  timerId: number;
  appState: AppState;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.appState = AppState.ENTER_ANSWER;
    this.configForm = this.fb.group({
      speed: ['', Validators.required],
      topic: ['', Validators.required],
      level: ['', Validators.required],
      digitsCnt: [2, Validators.required],
      operationsCnt: ['', Validators.required],
    });
    // this.startTimer();
  }

  selectLevel(newTopic: string, newLevel: string) {
    const { level, topic } = this.configForm.value;
    const isSameLevel =
      newTopic === topic &&
      newLevel === level;
    if (isSameLevel) {
      this.configForm.patchValue({
        topic: null,
        level: null,
      });
    } else {
      this.configForm.patchValue({
        topic: newTopic,
        level: newLevel,
      });
    }
  }

  setDigitsCnt(cnt: number) {
    this.configForm.patchValue({
      digitsCnt: cnt,
    });
  }

  start() {
    this.taskConfig = this.configForm.value;
    this.appState = AppState.RUNNING;
  }

  operationToString(operation: IOperation): string {
    return `${operation.operationType}${operation.operand}`;
  }

  get currentOperationString(): string {
    if (this.currentOperationIndex === -1) {
      return '';
    }
    return this.operationToString(this.operations[this.currentOperationIndex]);
  }

  get pastOperationStrings(): string[] {
    if (this.currentOperationIndex === -1) {
      return [''];
    }
    return this.operations
      .slice(0, this.currentOperationIndex + 1)
      .map(operation => this.operationToString(operation));
  }

  startTimer() {
    this.currentOperationIndex = -1;
    this.timerId = window.setInterval(
      () => this.onNextOperation(),
      this.taskConfig.speed * 1000,
    );
  }

  playTickSound() {
    new Audio('../../assets/tick.mp3').play();
  }

  onNextOperation() {
    this.currentOperationIndex++;
    if (this.currentOperationIndex === this.operations.length) {
      window.clearInterval(this.timerId);
      // this.currentOperationIndex = 0;
    } else {
      this.playTickSound();
    }
  }
}
