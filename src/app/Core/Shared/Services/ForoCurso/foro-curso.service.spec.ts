import { TestBed } from '@angular/core/testing';

import { ForoCursoService } from './foro-curso.service';

describe('ForoCursoService', () => {
  let service: ForoCursoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForoCursoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
