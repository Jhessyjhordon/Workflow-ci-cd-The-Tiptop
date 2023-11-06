import { TestBed } from '@angular/core/testing';

import { AgeService } from './age.service';

describe('AgeServiceService', () => {
  let service: AgeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
