import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { IGameMap } from '../interfaces';
import { environment } from '../../environments/environment';

const URL = `${environment.apiUrl}/admin/map`;

@Injectable()
export class MapService {
  private map: IGameMap = null;

  constructor(private http: HttpClient) {
  }

  getMap(): Observable<IGameMap> {
    if (this.map) {
      return of(this.map);
    }
    return this.http.get<IGameMap>(URL)
      .pipe(tap(map => this.map = map));
  }

  updateMap(map: IGameMap): Observable<IGameMap> {
    return this.http.put<IGameMap>(URL, map)
      .pipe(tap(updatedMap => this.map = updatedMap));
  }
}
