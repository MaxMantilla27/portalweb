import { TestBed } from '@angular/core/testing';

import { OperacionesNotaService } from './operaciones-nota.service';

describe('OperacionesNotaService', () => {
  let service: OperacionesNotaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperacionesNotaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
