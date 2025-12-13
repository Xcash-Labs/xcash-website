import { TestBed } from '@angular/core/testing';

import { LoadconfigService } from './loadconfig.service';

describe('LoadconfigService', () => {
  let service: LoadconfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadconfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
