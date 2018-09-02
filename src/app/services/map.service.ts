import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { IGameMap, TopicName, ILevel, ITopic } from '../interfaces';
import { environment } from '../../environments/environment';

const URL = `${environment.apiUrl}/admin/map`;

export const MAP_STRUCTURE: IGameMap = [
  {
    topicName: TopicName.SIMPLE,
    levels: [],
  },
  {
    topicName: TopicName.BROTHER,
    levels:  [],
  },
  {
    topicName: TopicName.FRIEND,
    levels:  [],
  },
  {
    topicName: TopicName.FRIEND_PLUS_BROTHER,
    levels:  [],
  },
];

@Injectable()
export class MapService {
  private map: IGameMap = MAP_STRUCTURE;

  constructor(private http: HttpClient) {
  }


  getLevel(topicName: TopicName, levelName: string): Observable<ILevel> {
    const topic = this.findTopic(topicName);
    const level = topic.levels.find(l => l.levelName === levelName);
    if (level) {
      return of(level);
    }
    return this.http.get<ILevel>(`${URL}/${topicName}/${levelName}`)
      .pipe(tap(l => topic.levels.push(l)));
  }

  private findTopic(topicName: string): ITopic {
    const topic = this.map.find(t => t.topicName === topicName);
    return topic;
  }

  updateMap(topicName: TopicName, levelName: string, level: ILevel): Observable<ILevel> {
    return this.http.put<ILevel>(`${URL}/${topicName}/${levelName}`, level)
      .pipe(tap((l) => {
        const topic = this.findTopic(topicName);
        const levelInd = topic.levels.findIndex(ll => ll.levelName === levelName);
        topic.levels[levelInd] = l;
      }));
  }
}
