import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Pageable } from '../model/pageable';

const url = 'http://localhost:3000/';
const dbName = 'airbnb';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  constructor(private httpClient: HttpClient) { }

  getList<T>(skip: number): Observable<Pageable<T>> {
    const options = { params: new HttpParams().set('skip', skip ? skip.toString() : '0') };

    return <Observable<Pageable<T>>>this.httpClient.get(`${url}${dbName}`, options);
  }
}
