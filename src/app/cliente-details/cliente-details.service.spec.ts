import { TestBed } from '@angular/core/testing';

import { clienteDetailsService } from './cliente-details.service';

describe('clienteDetailsService', () => {
  let service: clienteDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(clienteDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
