import { TestBed } from '@angular/core/testing';

import { XcashPaymentsService } from './xcash-payments.service';

describe('XcashPaymentsService', () => {
  let service: XcashPaymentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XcashPaymentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
