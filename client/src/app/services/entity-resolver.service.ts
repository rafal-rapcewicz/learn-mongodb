import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';

import { EntityService } from './entity.service';

@Injectable({
  providedIn: 'root'
})
export class EntityResolverService implements Resolve<any> {

  constructor(private entityService: EntityService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const id = parseInt(route.paramMap.get('id'), 10);

    return this.entityService.getById(id);
  }
}
