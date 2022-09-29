import { TestBed } from '@angular/core/testing';

import { SideStoreDataService } from './data.service';

describe('DataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SideStoreDataService = TestBed.get(SideStoreDataService);
    expect(service).toBeTruthy();
  });
});
