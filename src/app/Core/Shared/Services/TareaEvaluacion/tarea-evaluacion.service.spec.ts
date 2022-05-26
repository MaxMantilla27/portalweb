import { TestBed } from '@angular/core/testing';

import { TareaEvaluacionService } from './tarea-evaluacion.service';

describe('TareaEvaluacionService', () => {
  let service: TareaEvaluacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TareaEvaluacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
