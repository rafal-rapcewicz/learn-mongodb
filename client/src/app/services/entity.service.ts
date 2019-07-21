import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const url = 'http://localhost:3000/';
const dbName = 'airbnb';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

  constructor(private httpClient: HttpClient) { }

  getList(skip: number): Observable<any[]> {
    const options = { params: new HttpParams().set('skip', skip ? skip.toString() : '0') };

    return <Observable<any[]>>this.httpClient.get(`${url}${dbName}`, options);
  }
}
