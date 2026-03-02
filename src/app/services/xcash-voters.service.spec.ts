import { TestBed } from '@angular/core/testing';

import { XcashVotersService } from './xcash-voters.service';

describe('XcashVotersService', () => {
  let service: XcashVotersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XcashVotersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
