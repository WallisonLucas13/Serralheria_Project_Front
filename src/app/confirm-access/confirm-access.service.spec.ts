import { TestBed } from '@angular/core/testing';

import { ConfirmAccessService } from './confirm-access.service';

describe('ConfirmAccessService', () => {
  let service: ConfirmAccessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfirmAccessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
