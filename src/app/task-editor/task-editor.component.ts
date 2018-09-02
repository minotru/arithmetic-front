import { Component, OnInit } from '@angular/core';
import { IGameMap, TopicName, OperationType, RulesType, ILevel, IRule, IRulesByOperation } from '../interfaces';
import { MapService } from '../services/map.service';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators } from '@angular/forms';
import { TOPICS } from '../topics';
import { MatSelectChange } from '@angular/material';


@Component({
  selector: 'app-task-editor',
  templateUrl: './task-editor.component.html',
  styleUrls: ['./task-editor.component.scss']
})
export class TaskEditorComponent implements OnInit {
  level: ILevel;
  form: FormGroup;
  topics = TOPICS;
  isEditing: boolean;
  textareaControl: FormControl;
  ranges: string[];

  constructor(
    private mapService: MapService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    // this.mapService.getMap().subscribe(map => this.map = map);
    this.form = this.fb.group({
      topic: [''],
      level: [''],
      operation: ['minus'],
      rules: this.fb.array([]),
      rulesType: [RulesType.ALLOWED],
    });
    this.textareaControl = this.fb.control('');
    this.isEditing = false;
    this.ranges = [];
  }

  get levels(): string[] {
    const topicName = this.form.value['topic'];
    if (topicName) {
      return this.topics.find(
        topic => topic.name === topicName
      ).levels;
    }
    return [];
  }

  addRule(rule: IRule = {
    value: undefined,
    ranges: [],
  }) {
   this.ruleControls.push(this.fb.control(rule));
  }

  textToRanges(rawText: string): {
    ranges: string[],
    badRanges: string[],
  } {
    const text = rawText.replace(/ /g, '');
    const tokens = text.split(',');
    const regex = /^\d{1,3}(-\d{1,3})?$/;
    const ranges: string[] = [];
    const badRanges: string[] = [];
    tokens.forEach((token, index) => {
      if (!token) {
        return;
      }
      if (regex.test(token)) {
        const [part1, part2] = token
          .split('-')
          .map(part => Number.parseInt(part));
        if ((part2 && part2 >= part1) || !part2) {
          ranges.push(token);
        } else {
          badRanges.push(token);
        }
      } else {
        badRanges.push(token);
      }
    });

    return { ranges, badRanges };
  }

  onSelectLevel() {
    const topicName = this.form.value['topic'];
    const levelName = this.form.value['level'];
    this.mapService
      .getLevel(topicName, levelName)
      .subscribe((level) => {
        this.level = level;
        this.loadRules();
      });
  }

  isRangeInput(symbol: string): boolean {
    return symbol >= '0' && symbol <= '9' ||
      [' ', ',', '-'].includes(symbol);
  }

  edit() {
    this.isEditing = true;
  }

  closeWithoutSave() {
    this.isEditing = false;
  }

  save() {
    const text: string = this.textareaControl.value;
    const { ranges, badRanges } = this.textToRanges(text);
    if (badRanges.length) {
      this.textareaControl.setErrors({ badRanges });
    } else {
      this.ranges = ranges;
      this.isEditing = false;
    }
  }

  setOperation() {
  }

  clearRules() {
    this.form.controls['rules'].reset([]);
  }

  loadRules() {
    this.clearRules();
    const operation = <OperationType>this.form.value['operation'];
    let rulesByOperation: IRulesByOperation;
    if (operation === OperationType.PLUS) {
      rulesByOperation = this.level.plus;
    } else {
      rulesByOperation = this.level.minus;
    }
    this.form.patchValue({
      rulesType: rulesByOperation.rulesType,
    });
    console.log('before');
    rulesByOperation.rules.forEach(
      rule => this.ruleControls.push(this.fb.group(rule))
    );
  }

  get ruleControls(): FormArray {
    return this.form.controls['rules'] as FormArray;
  }
}
