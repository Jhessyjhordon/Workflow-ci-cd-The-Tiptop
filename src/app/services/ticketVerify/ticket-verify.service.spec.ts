import { TestBed } from '@angular/core/testing';

import { TicketVerifyService } from './ticket-verify.service';

describe('TicketVerifyService', () => {
  let service: TicketVerifyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketVerifyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
