import { TestBed } from '@angular/core/testing';

import { XcashPendingpaymentsService } from './xcash-pendingpayments.service';

describe('XcashPendingpaymentsService', () => {
  let service: XcashPendingpaymentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XcashPendingpaymentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
