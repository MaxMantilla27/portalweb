import { TestBed } from '@angular/core/testing';

import { OperacionesAsistenciaService } from './operaciones-asistencia.service';

describe('OperacionesAsistenciaService', () => {
  let service: OperacionesAsistenciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OperacionesAsistenciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
