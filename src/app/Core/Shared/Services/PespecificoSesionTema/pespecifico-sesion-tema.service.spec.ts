import { TestBed } from '@angular/core/testing';

import { PespecificoSesionTemaService } from './pespecifico-sesion-tema.service';

describe('PespecificoSesionTemaService', () => {
  let service: PespecificoSesionTemaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PespecificoSesionTemaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
