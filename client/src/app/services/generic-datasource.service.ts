import { Injectable } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenericDatasourceService<T> implements DataSource<T> {

  private data = new BehaviorSubject<T[]>([]);

  constructor() { }

  connect(): BehaviorSubject<T[]> {
    return this.data;
  }
  
  disconnect() {
    this.data.complete();
  }

  push(page: T[]) {
    this.data.next(page);
  }
}
