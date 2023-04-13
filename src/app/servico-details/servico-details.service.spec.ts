import { TestBed } from '@angular/core/testing';

import { ServicoDetailsService } from './servico-details.service';

describe('ServicoDetailsService', () => {
  let service: ServicoDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicoDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
