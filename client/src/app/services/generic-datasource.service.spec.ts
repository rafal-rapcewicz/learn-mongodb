import { TestBed } from '@angular/core/testing';

import { GenericDatasourceService } from './generic-datasource.service';

describe('GenericDatasourceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GenericDatasourceService<any> = TestBed.get(GenericDatasourceService);
    expect(service).toBeTruthy();
  });
});
