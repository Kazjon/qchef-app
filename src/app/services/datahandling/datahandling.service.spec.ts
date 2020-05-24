import { TestBed } from '@angular/core/testing';

import { DataHandlingService } from './datahandling.service';

describe('DatahandlingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataHandlingService = TestBed.get(DataHandlingService);
    expect(service).toBeTruthy();
  });
});
