import { Component, OnInit } from '@angular/core';
import { IGameMap, TopicName } from '../interfaces';
import { MapService } from '../services/map.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TOPICS } from '../topics';

@Component({
  selector: 'app-task-editor',
  templateUrl: './task-editor.component.html',
  styleUrls: ['./task-editor.component.scss']
})
export class TaskEditorComponent implements OnInit {
  map: IGameMap = null;
  form: FormGroup;
  topics = TOPICS;

  constructor(
    private mapService: MapService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.mapService.getMap().subscribe(map => this.map = map);
    this.form = this.fb.group({});
  }

}
