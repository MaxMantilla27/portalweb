import { TestBed } from '@angular/core/testing';

import { OperacionesPEspecificoService } from './operaciones-pespecifico.service';

describe('OperacionesPEspecificoService', () => {
  let service: OperacionesPEspecificoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperacionesPEspecificoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
