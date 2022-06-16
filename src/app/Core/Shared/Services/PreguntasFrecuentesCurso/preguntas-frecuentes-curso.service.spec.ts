import { TestBed } from '@angular/core/testing';

import { PreguntasFrecuentesCursoService } from './preguntas-frecuentes-curso.service';

describe('PreguntasFrecuentesCursoService', () => {
  let service: PreguntasFrecuentesCursoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreguntasFrecuentesCursoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
