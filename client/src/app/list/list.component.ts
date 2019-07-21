import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Subscription, Observable } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';

import { EntityService } from '../services/entity.service';
import { GenericDatasourceService } from '../services/generic-datasource.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  readonly displayedColumns: string[] = ['_action', 'name', 'summary', 'room_type'];
  readonly dataColumns: string[] = this.displayedColumns.filter(column => column !== '_action');
  dataSource: GenericDatasourceService<any[]>;
  total$: Subject<number> = new Subject();

  private subscriptions: Subscription[] = [];

  constructor(private entityService: EntityService) { }

  ngOnInit() {
    this.dataSource = new GenericDatasourceService<any>();
    this.loadPage(0);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onPageChange(event: PageEvent) {
    this.loadPage(event.pageIndex * event.pageSize);
  }

  private loadPage(skip: number) {
    this.subscriptions.push(
      this.entityService.getList<any>(skip).subscribe(data => {
        this.dataSource.push(data.data);
        this.total$.next(data.total);
      })
    );
  }
}
