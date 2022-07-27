import { TestBed } from '@angular/core/testing';

import { IntegraEsquemaEvaluacionService } from './integra-esquema-evaluacion.service';

describe('IntegraEsquemaEvaluacionService', () => {
  let service: IntegraEsquemaEvaluacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntegraEsquemaEvaluacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
