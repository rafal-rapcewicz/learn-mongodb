import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { EntityService } from '../services/entity.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  readonly displayedColumns: string[] = ['_action', 'name', 'summary', 'room_type'];
  readonly dataColumns: string[] = this.displayedColumns.filter(column => column !== '_action');
  dataSource$: Observable<any[]>;

  constructor(private entityService: EntityService) { }

  ngOnInit() {
    this.dataSource$ = this.entityService.getList(0);
  }

}
