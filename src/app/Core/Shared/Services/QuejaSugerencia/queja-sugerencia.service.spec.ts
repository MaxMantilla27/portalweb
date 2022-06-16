import { TestBed } from '@angular/core/testing';

import { QuejaSugerenciaService } from './queja-sugerencia.service';

describe('QuejaSugerenciaService', () => {
  let service: QuejaSugerenciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuejaSugerenciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
