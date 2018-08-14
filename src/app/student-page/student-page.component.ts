import { Component, OnInit } from '@angular/core';
import { ConstantPool } from '@angular/compiler';

interface ITopic {
  name: string;
  caption: string;
  levels: string[];
}

interface ITaskConfig {
  topic: string;
  level: string;
  digitsCnt: number;
  speed: number;
  operationsCnt: number;
}

const SPEED_VALUES: number[] = [
  7, 6, 5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.7,
];

const TOPICS: ITopic[] = [
  {
    name: 'simple',
    caption: 'ПРОСТО',
    levels: ['2', '3', '4', '5', '6', '7', '8', '9'],
  },
  {
    name: 'brother',
    caption: 'БРАТ',
    levels: ['4', '3', '2', '1'],
  },
  {
    name: 'friend',
    caption: 'ДРУГ',
    levels: ['9', '8', '7', '6', '5', '4', '3', '2', '1'],
  },
  {
    name: 'friend-plus-brother',
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
  taskConfig: ITaskConfig = { digitsCnt: 1 } as ITaskConfig;
  speedValues: number[] = SPEED_VALUES;

  constructor() { }

  ngOnInit() {
  }

  selectLevel(topic: string, level: string) {
    const isSameLevel =
      this.taskConfig.topic === topic &&
      this.taskConfig.level === level;
    if (isSameLevel) {
      this.taskConfig.topic = null;
      this.taskConfig.level = null;
    } else {
      this.taskConfig.topic = topic;
      this.taskConfig.level = level;
    }
  }

  setDigitsCnt(cnt: number) {
    this.taskConfig.digitsCnt = cnt;
  }


  validateTaskConfig() {
    return Object.values(this.taskConfig).every(v => !!v);
  }

  start() {
    if (!this.validateTaskConfig()) {
      return;
    }
  }
}
