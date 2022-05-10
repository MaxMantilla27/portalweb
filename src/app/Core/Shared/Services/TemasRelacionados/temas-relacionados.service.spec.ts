import { TestBed } from '@angular/core/testing';

import { TemasRelacionadosService } from './temas-relacionados.service';

describe('TemasRelacionadosService', () => {
  let service: TemasRelacionadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemasRelacionadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
