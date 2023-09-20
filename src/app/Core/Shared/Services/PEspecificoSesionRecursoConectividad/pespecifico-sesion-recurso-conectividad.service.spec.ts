import { TestBed } from '@angular/core/testing';

import { PEspecificoSesionRecursoConectividadService } from './pespecifico-sesion-recurso-conectividad.service';

describe('PEspecificoSesionRecursoConectividadService', () => {
  let service: PEspecificoSesionRecursoConectividadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PEspecificoSesionRecursoConectividadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
