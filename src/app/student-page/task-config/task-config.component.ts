import { Component, OnInit } from '@angular/core';
import { ITaskConfig, ITopicPreview, TopicName, TopicType } from 'src/app/interfaces';
import { ALL_TOPICS } from 'src/app/topics';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TaskService, EMPTY_TASK_CONFIG } from 'src/app/services/task.service';
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
      topic: [],
      level: [],
      digitsCnt: [],
      operationsCnt: [],
      withRemainder: []
    });
    this.configForm.setValue(this.taskService.getTaskConfig());
    this.updateValidators();
  }

  get showPastOperations(): boolean {
    return this.taskService.getShowPastOperations();
  }

  private setRequiredFields(requiredFields: string[]) {
    const allRequiredFields = [...requiredFields, 'level', 'topic'];
    Object.keys(this.configForm.controls).forEach((key) => {
      this.configForm.get(key).clearValidators();
      if (allRequiredFields.includes(key)) {
        this.configForm.controls[key].setValidators(Validators.required);
      }
      this.configForm.get(key).updateValueAndValidity();
    });
  }

  private updateValidators() {
    const validationFieldsMap = {
      [TopicType.PLUS_MINUS]: ['digitsCnt', 'speed', 'operationsCnt'],
      [TopicType.MULTIPLICATION]: [],
      [TopicType.DIVISION]: ['withRemainder']
    };
    this.setRequiredFields(validationFieldsMap[this.getTopicType()]);
  }

  getTopicType() {
    return this.taskService.getTopicType(<TopicName>this.configForm.value.topic);
  }

  isPlusMinusTopic() {
    return this.getTopicType() === TopicType.PLUS_MINUS;
  }

  isDivisionTopic() {
    return this.getTopicType() === TopicType.DIVISION;
  }

  isMultiplicationTopic() {
    return this.getTopicType() === TopicType.MULTIPLICATION;
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

    const oldTopicType = this.taskService.getTopicType(<TopicName>newTopic);
    const newTopicType = this.taskService.getTopicType(<TopicName>topic);
    if (oldTopicType !== newTopicType) {
      this.configForm.setValue({
        ...EMPTY_TASK_CONFIG,
        topic: newTopic,
        level: newLevel
      });
      if (newTopicType !== TopicType.PLUS_MINUS && !this.showPastOperations) {
        this.taskService.toggleShowPastOperations();
      }
      this.updateValidators();
    }
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
      .generateTask({ ...taskConfig, topicType: this.getTopicType() })
      .subscribe((task) => {
        this.taskService.setCurrentTask(task);
        this.router.navigate(['student', 'task-runner']);
      });
  }
}
