import { TestBed } from '@angular/core/testing';

import { OperacionesEvaluacionService } from './operaciones-evaluacion.service';

describe('OperacionesEvaluacionService', () => {
  let service: OperacionesEvaluacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperacionesEvaluacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
