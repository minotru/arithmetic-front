import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TopicName, IOperation, OperationType, ITaskConfig, ITask, ITopicPreview } from '../interfaces/task';
import { TaskService } from '../services/task.service';
import { ALL_TOPICS } from '../topics';
import { OPERATIONS } from '../mocks/operations';

const SPEED_VALUES: number[] = [
  7, 6, 5, 4, 3.5, 3, 2.5, 2.2, 2, 1.8, 1.5, 1.2, 1, 0.9, 0.8, 0.7,
];

const minSpeedToUseVoiceSythesis = 1.5;

const speechSpeed = 3;
const speechPitch = 1;

enum AppState {
  CONFIG = 'config',
  RUNNING = 'running',
  ENTER_ANSWER = 'enter_answer',
  ANSWERED = 'answered',
}

const DEFAULT_TASK_CONFIG: ITaskConfig = {
  speed: null,
  topic: null,
  level: null,
  digitsCnt: 2,
  operationsCnt: null,
  withRemainder: false,
  showPastOperations: false
};

const soundMap = {
  tick: 'assets/tick.mp3',
  correct: 'assets/correct.mp3',
  error: 'assets/error.mp3'
};

const operationTypeToText = {
  [OperationType.PLUS]: 'плюс',
  [OperationType.MINUS]: 'минус',
};
@Component({
  selector: 'app-student-page',
  templateUrl: './student-page.component.html',
  styleUrls: ['./student-page.component.scss']
})
export class StudentPageComponent implements OnInit {
  topics: ITopicPreview[] = ALL_TOPICS;
  speedValues: number[] = SPEED_VALUES;
  configForm: FormGroup;
  task: ITask = {} as ITask;
  currentOperationIndex = 0;
  timerId: number;
  appState: AppState;
  @ViewChild('answerInput') answerInput: HTMLInputElement;
  @ViewChild('pastOperationsList') pastOperationsList: HTMLElement;
  answerInputControl = new FormControl('');
  isLoading = false;
  speechSynthesis: SpeechSynthesis;
  shouldPronounceOperation: boolean;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
  ) { }

  ngOnInit() {
    this.configForm = this.fb.group({
      speed: [],
      topic: ['', Validators.required],
      level: ['', Validators.required],
      digitsCnt: [2],
      operationsCnt: [''],
      withRemainder: [false],
      showPastOperations: [false]
    });
    this.configForm.setValue(DEFAULT_TASK_CONFIG);
    this.initSpeechSynthesis();
    this.setPlusMinusValidators();
    this.appState = AppState.CONFIG;
  }

  operationToText(operation: IOperation): string {
    return `${operationTypeToText[operation.operationType]} ${operation.operand}`;
  }

  setupMockTask() {
    this.task = {
      operations: [...OPERATIONS, ...OPERATIONS, ...OPERATIONS],
      config: {
        speed: 1,
      },
    } as ITask;
  }

  private setDivisionValidators() {
    this.configForm.controls['speed']
      .clearValidators();
    this.configForm.controls['digitsCnt']
      .clearValidators();
    this.configForm.controls['operationsCnt']
      .clearValidators();
    this.configForm.controls['withRemainder']
      .setValidators(Validators.required);
  }

  private setPlusMinusValidators() {
    this.configForm.controls['speed']
      .setValidators(Validators.required);
    this.configForm.controls['digitsCnt']
      .setValidators(Validators.required);
    this.configForm.controls['operationsCnt']
      .setValidators(Validators.required);
    this.configForm.controls['withRemainder']
      .clearValidators();

  }

  private setMultiplicationValidators() {
    this.setDivisionValidators();
    this.configForm.controls['withRemainder']
      .clearValidators();
  }

  isPlusMinusTopic(): boolean {
    const topic: TopicName = this.configForm.value['topic'];
    return topic !== TopicName.MULTIPLICATION &&
      topic !== TopicName.DIVISION;
  }

  isDivisionTopic(): boolean {
    return this.configForm.value['topic'] === TopicName.DIVISION;
  }


  initSpeechSynthesis() {
    this.speechSynthesis = window.speechSynthesis;
  }

  pronounceNextOperation(operation: IOperation) {
    const utterance = new SpeechSynthesisUtterance(this.operationToText(operation));
    utterance.voice = this.speechSynthesis.getVoices()[0];
    utterance.lang = 'ru';
    utterance.rate = speechSpeed;
    utterance.pitch = speechPitch;
    this.speechSynthesis.speak(utterance);
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
      return;
    } else {
      this.configForm.patchValue({
        topic: newTopic,
        level: newLevel,
      });
    }

    if (this.isPlusMinusTopic()) {
      this.setPlusMinusValidators();
    } else if (this.isDivisionTopic()) {
      this.setDivisionValidators();
    } else {
      this.setMultiplicationValidators();
    }
    Object.values(this.configForm.controls).forEach(c => c.updateValueAndValidity());
    this.configForm.updateValueAndValidity();
  }

  setDigitsCnt(cnt: number) {
    this.configForm.patchValue({
      digitsCnt: cnt,
    });
  }

  onStart() {
    this.isLoading = true;
    const taskConfig = Object.assign({}, this.configForm.value) as ITaskConfig;
    taskConfig.speed = +taskConfig.speed;
    delete taskConfig.showPastOperations;
    this.taskService
      .generateTask(taskConfig)
      .subscribe((task) => {
        this.task = Object.assign(this.task, task);
        this.isLoading = false;
        this.runApp();
      });
  }

  get showPastOperations() {
    return this.configForm.value.showPastOperations;
  }

  operationToString(operation: IOperation): string {
    const opMap: any = {
      [OperationType.PLUS]: '+',
      [OperationType.MINUS]: '-',
      [OperationType.MULTIPLY]: '*',
      [OperationType.DIVIDE]: '/',
    };
    return `${opMap[operation.operationType]}${operation.operand}`;
  }

  get currentOperationString(): string {
    if (this.currentOperationIndex === -1) {
      return ' ';
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

  toggleShowPastOperations() {
    const showPastOperations = this.configForm.value.showPastOperations;
    this.configForm.patchValue({
      showPastOperations: !showPastOperations
    });
  }

  isNumberInput(event: any): boolean {
    return event.key >= '0' && event.key <= '9';
  }

  runApp() {
    this.appState = AppState.RUNNING;
    this.currentOperationIndex = -1;
    this.speechSynthesis.cancel();
    this.shouldPronounceOperation = this.task.config.digitsCnt < 3 && this.task.config.speed >= minSpeedToUseVoiceSythesis;
    this.timerId = window.setInterval(
      () => this.onNextOperation(),
      +this.task.config.speed * 1000);

  }

  scrollToLastOperation() {
    const lastOperation = <HTMLElement>this.pastOperationsList.lastChild;
    if (lastOperation && lastOperation.scrollIntoView) {
      lastOperation.scrollIntoView();
    }
  }

  onNextOperation() {
    this.scrollToLastOperation();
    if (this.currentOperationIndex + 1 === this.operations.length) {
      window.clearInterval(this.timerId);
      this.appState = AppState.ENTER_ANSWER;
    } else {
      this.currentOperationIndex++;
      if (this.shouldPronounceOperation) {
        this.pronounceNextOperation(this.operations[this.currentOperationIndex]);
      } else {
        this.playSound('tick');
      }
    }
  }

  onAnswerInput() {
    const userAnswer = Number.parseInt(this.answerInput.value);
    this.isLoading = true;
    this.taskService
      .checkAnswer(this.task.id, userAnswer)
      .subscribe((task => {
        this.task = Object.assign(this.task, task);
        this.answerInput.disabled = true;
        if (this.task.isCorrect) {
          this.answerInput.classList.add('valid');
          this.playSound('correct');
        } else {
          this.playSound('error');
          this.answerInput.value = this.task.answer.toString();
          this.answerInput.classList.add('invalid');
        }
        this.appState = AppState.ANSWERED;
        this.isLoading = false;
      }));
  }

  playSound(soundName: string) {
    const soundPath = soundMap[soundName];
    if (!soundPath) {
      throw new Error(`there is no sound ${soundName}`);
    }
    const mp3Source = `<source src="${soundPath}" type="audio/mpeg">`;
    const soundContainer = document.getElementById('sound-container');
    soundContainer.innerHTML = `<audio autoplay="autoplay">${mp3Source}</audio>`;
  }

  get operations(): IOperation[] {
    return this.task.operations;
  }

  @ViewChild('answerInput') set setAnswerInput(ref: ElementRef) {
    if (ref) {
      this.answerInput = ref.nativeElement;
    }
  }

  @ViewChild('pastOperationsList') set setPastOperations(ref: ElementRef) {
    if (ref) {
      this.pastOperationsList = ref.nativeElement;
    }
  }

  isCorrect(): boolean {
    return this.task.isCorrect;
  }

  onRetry() {
    this.onStart();
  }

  onClear() {
    this.answerInput.value = '';
    this.appState = AppState.CONFIG;
  }
}
