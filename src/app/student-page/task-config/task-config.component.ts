import { Component, OnInit } from '@angular/core';
import { ITaskConfig, ITopicPreview, TopicName, ITask } from 'src/app/interfaces';
import { ALL_TOPICS } from 'src/app/topics';
import { FormGroup, FormBuilder, Validators, ValidatorFn } from '@angular/forms';
import { TaskService } from 'src/app/services/task.service';
import { OPERATIONS } from 'src/app/mocks/operations';
import { Router } from '@angular/router';

const SPEED_VALUES: number[] = [
  7, 6, 5, 4, 3.5, 3, 2.5, 2.2, 2, 1.8, 1.5, 1.2, 1, 0.9, 0.8, 0.7,
];

@Component({
  selector: 'app-task-config',
  templateUrl: './task-config.component.html',
  styleUrls: ['./task-config.component.scss']
})
export class TaskConfigComponent implements OnInit {
  topics: ITopicPreview[] = ALL_TOPICS;
  speedValues: number[] = SPEED_VALUES;
  configForm: FormGroup;
  isLoading: boolean;

  constructor(
    private fb: FormBuilder,
    public taskService: TaskService,
    private router: Router
  ) { }

  ngOnInit() {
    this.configForm = this.fb.group({
      speed: [],
      topic: [''],
      level: [''],
      digitsCnt: [2],
      operationsCnt: [''],
      withRemainder: [false]
    });
    this.configForm.setValue(this.taskService.getTaskConfig());
    this.setPlusMinusValidators();
  }

  get showPastOperations(): boolean {
    return this.taskService.getShowPastOperations();
  }

  // setupMockTask() {
  //   this.task = {
  //     operations: [...OPERATIONS, ...OPERATIONS, ...OPERATIONS],
  //     config: {
  //       speed: 1,
  //     },
  //   } as ITask;
  // }

  private setRequiredFields(requiredFields: string[]) {
    this.configForm.clearValidators();
    [...requiredFields, 'level', 'topic'].forEach(
      (key) => this.configForm.controls[key].setValidators(Validators.required)
    );
  }

  private setDivisionValidators() {
    this.setRequiredFields(['withRemainder']);
  }

  private setPlusMinusValidators() {
    this.setRequiredFields(['digitsCnt', 'speed', 'operationsCnt']);

  }

  private setMultiplicationValidators() {
    this.setRequiredFields([]);
  }

  isPlusMinusTopic(): boolean {
    const topic: TopicName = this.configForm.value['topic'];
    return topic !== TopicName.MULTIPLICATION &&
      topic !== TopicName.DIVISION;
  }

  isDivisionTopic(): boolean {
    return this.configForm.value['topic'] === TopicName.DIVISION;
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
    }
    this.configForm.patchValue({
      topic: newTopic,
      level: newLevel,
    });

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
    this.taskService.setTaskConfig(taskConfig);
    this.taskService
      .generateTask(taskConfig)
      .subscribe((task) => {
        this.taskService.setCurrentTask(task);
        this.router.navigate(['student', 'task-runner']);
      });
  }
}
