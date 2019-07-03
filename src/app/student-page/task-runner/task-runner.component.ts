import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OperationType, IOperation, ITask } from 'src/app/interfaces';
import { TaskService } from 'src/app/services/task.service';
import { Router } from '@angular/router';

const minSpeedToUseVoiceSythesis = 1.5;

const speechSpeed = 3;
const speechPitch = 1;
const speechLang = 'ru-RU';

const soundMap = {
  tick: 'assets/tick.mp3',
  correct: 'assets/correct.mp3',
  error: 'assets/error.mp3'
};

const operationTypeToText = {
  [OperationType.PLUS]: 'плюс',
  [OperationType.MINUS]: 'минус',
};

enum AppState {
  CONFIG = 'config',
  RUNNING = 'running',
  ENTER_ANSWER = 'enter_answer',
  ANSWERED = 'answered',
}

@Component({
  selector: 'app-task-runner',
  templateUrl: './task-runner.component.html',
  styleUrls: ['./task-runner.component.scss']
})
export class TaskRunnerComponent implements OnInit {
  currentOperationIndex = 0;
  timerId: number;
  isLoading: boolean;
  userAnswer: { answer: string }[];
  answerLabels: string[];
  @ViewChild('pastOperationsList') pastOperationsList: HTMLElement;
  speechSynthesis: SpeechSynthesis;
  shouldPronounceOperation: boolean;
  appState: AppState;
  task: ITask;
  speechVoice: SpeechSynthesisVoice;
  hasSpeechSupport: boolean;

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {
    this.task = this.taskService.getCurrentTask();
    if (this.task.config.withRemainder) {
      this.userAnswer = [{ answer: '' }, { answer: '' }];
      this.answerLabels = ['Частное', 'Остаток'];
    } else {
      this.userAnswer = [{ answer: '' }];
      this.answerLabels = ['Ответ'];
    }
  }

  ngOnInit() {
    this.initSpeechSynthesis();
    this.runTask();
  }

  isAnswerEntered(): boolean {
    return this.userAnswer.every(value => !!value.answer);
  }

  operationToText(operation: IOperation): string {
    return `${operationTypeToText[operation.operationType]} ${operation.operand}`;
  }

  setSpeechVoice(lang: string) {
    const speechVoice = this.speechSynthesis.getVoices().find((voice) => voice.lang === lang);
    if (!speechVoice) {
      console.warn('This browser doesn not support russian speech synthesis');
      this.hasSpeechSupport = false;
      return;
    }
    this.speechVoice = speechVoice;
    this.hasSpeechSupport = true;
  }

  initSpeechSynthesis() {
    this.speechSynthesis = window.speechSynthesis;
    if (!this.speechSynthesis) {
      console.warn('No speech synthesis support');
      this.hasSpeechSupport = false;
      return;
    }
    this.setSpeechVoice(speechLang);
    this.speechSynthesis.onvoiceschanged = () => this.setSpeechVoice(speechLang);
  }

  pronounceNextOperation(operation: IOperation) {
    const text = this.operationToText(operation);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.speechVoice;
    utterance.lang = speechLang;
    utterance.rate = speechSpeed;
    utterance.pitch = speechPitch;
    this.speechSynthesis.speak(utterance);
  }

  get showPastOperations() {
    return this.taskService.getShowPastOperations();
  }

  operationToString(operation: IOperation): string {
    const opMap: any = {
      [OperationType.PLUS]: '+',
      [OperationType.MINUS]: '-',
      [OperationType.MULTIPLY]: '×',
      [OperationType.DIVIDE]: '÷',
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
    this.taskService.toggleShowPastOperations();
  }

  isNumberInput(char: string): boolean {
    return char >= '0' && char <= '9';
  }

  runTask() {
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
      if (this.shouldPronounceOperation && this.hasSpeechSupport) {
        this.pronounceNextOperation(this.operations[this.currentOperationIndex]);
      } else {
        this.playSound('tick');
      }
    }
  }

  onAnswerInput() {
    const isCorrect = this.userAnswer.every((value, ind) => +value.answer === this.task.answer[ind]);
    this.isLoading = true;
    this.taskService
      .checkAnswer(this.task.id, isCorrect)
      .subscribe(() => {
        this.task.isCorrect = isCorrect;
        if (this.task.isCorrect) {
          this.playSound('correct');
        } else {
          this.playSound('error');
          this.userAnswer = this.task.answer.map(answer => ({ answer: answer.toString() }));
        }
        this.appState = AppState.ANSWERED;
        this.isLoading = false;
      });
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

  @ViewChild('pastOperationsList') set setPastOperations(ref: ElementRef) {
    if (ref) {
      this.pastOperationsList = ref.nativeElement;
    }
  }

  isCorrect(): boolean {
    return this.task.isCorrect;
  }

  onClear() {
    this.router.navigate(['student', 'task-config']);
  }
}
