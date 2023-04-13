import { TestBed } from '@angular/core/testing';

import { clientesService } from './clientes.service';

describe('clientesService', () => {
  let service: clientesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(clientesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
