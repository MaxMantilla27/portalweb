import { TestBed } from '@angular/core/testing';

import { PEspecificoCarreraExamenService } from './pespecifico-carrera-examen.service';

describe('PEspecificoCarreraExamenService', () => {
  let service: PEspecificoCarreraExamenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PEspecificoCarreraExamenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
