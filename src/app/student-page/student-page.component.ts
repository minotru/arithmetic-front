import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TopicName, ITopic, IOperation, OperationType, ITaskConfig, ITask } from '../interfaces/task';
import { UserService } from '../services/user.service';
import { OPERATIONS } from '../mocks/operations';
import { TaskService } from '../services/task.service';

const SPEED_VALUES: number[] = [
  7, 6, 5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.7,
];

enum AppState {
  CONFIG = 'config',
  RUNNING = 'running',
  ENTER_ANSWER = 'enter_answer',
  ANSWERED = 'answered',
}

const DEFAULT_TASK_CONFIG: ITaskConfig =  {
  speed: null,
  topic: null,
  level: null,
  digitsCnt: 2,
  operationsCnt: null,
};

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
  speedValues: number[] = SPEED_VALUES;
  configForm: FormGroup;
  task: ITask = {} as ITask;
  currentOperationIndex = 0;
  timerId: number;
  appState: AppState;
  @ViewChild('answerInput') answerInput: HTMLInputElement;
  @ViewChild('pastOperationsBlock') pastOperationsBlock: HTMLElement;
  answerInputControl = new FormControl('');

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private taskService: TaskService,
  ) {}

  ngOnInit() {
    this.configForm = this.fb.group({
      speed: [0.3, Validators.required],
      topic: ['', Validators.required],
      level: ['', Validators.required],
      digitsCnt: [2, Validators.required],
      operationsCnt: ['', Validators.required],
    });
    this.appState = AppState.CONFIG;
    // this.onStart();
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

  onStart() {
    const taskConfig = this.configForm.value as ITaskConfig;
    // taskConfig.speed = 0.1;
    this.taskService
      .generateTask(taskConfig)
      .subscribe((task) => {
        this.task = Object.assign(this.task, task);
        this.runApp();
      });
  }

  operationToString(operation: IOperation): string {
    return `${operation.operationType}${operation.operand}`;
  }

  get currentOperationString(): string {
    if (this.currentOperationIndex === -1) {
      return '';
    }
    const currentOperation = this.operations[this.currentOperationIndex];
    return this.operationToString(currentOperation);
  }

  get pastOperations(): IOperation[] {
    if (this.currentOperationIndex === -1) {
      return [];
    }
    return this.operations
      .slice(0, this.currentOperationIndex + 1);
  }

  isNumberInput(event: any): boolean {
    return event.key >= '0' && event.key <= '9';
  }

  runApp() {
    this.appState = AppState.RUNNING;
    this.currentOperationIndex = -1;
    // this.answerInput.focus();
    window.setTimeout(() => {
      this.timerId = window.setInterval(
        () => this.onNextOperation(),
        this.task.config.speed * 1000);
      },
      1000,
    );
  }

  playTickSound() {
    new Audio('../../assets/tick.mp3').play();
  }

  onNextOperation() {
    if (this.currentOperationIndex + 1 === this.operations.length) {
      window.clearInterval(this.timerId);
      this.appState = AppState.ENTER_ANSWER;
      // this.answerInput.focus();
    } else {
      this.currentOperationIndex++;
      this.playTickSound();
    }
    this.pastOperationsBlock.scrollBy(50, 0);
  }

  onAnswerInput() {
    const userAnswer = Number.parseInt(this.answerInput.value);
    this.taskService
      .checkAnswer(this.task.id, userAnswer)
      .subscribe((task => {
        this.task = Object.assign(this.task, task);
        this.answerInput.disabled = true;
        if (this.task.isCorrect) {
          this.answerInput.classList.add('valid');
        } else {
          this.answerInput.value = this.task.answer.toString();
          this.answerInput.classList.add('invalid');
        }
        this.appState = AppState.ANSWERED;
      }));
  }

  get operations(): IOperation[] {
    return this.task.operations;
  }

  @ViewChild('answerInput') set setAnswerInput(ref: ElementRef) {
    if (ref) {
      this.answerInput = ref.nativeElement;
    }
  }

  @ViewChild('pastOperationsBlock') set setPastOperations(ref: ElementRef) {
    if (ref) {
      this.pastOperationsBlock = ref.nativeElement;
    }
  }

  isCorrect(): boolean {
    return this.task.isCorrect;
  }

  onRetry() {
    this.onStart();
  }

  onClear() {
    this.configForm.setValue(DEFAULT_TASK_CONFIG);
    this.answerInput.value = '';
    this.appState = AppState.CONFIG;
  }
}
