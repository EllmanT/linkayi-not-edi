import { TestBed } from '@angular/core/testing';

import { CloseDayServiceService } from './close-day-service.service';

describe('CloseDayServiceService', () => {
  let service: CloseDayServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CloseDayServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
