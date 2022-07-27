import { TestBed } from '@angular/core/testing';

import { AutoEvaluacionService } from './auto-evaluacion.service';

describe('AutoEvaluacionService', () => {
  let service: AutoEvaluacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AutoEvaluacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
