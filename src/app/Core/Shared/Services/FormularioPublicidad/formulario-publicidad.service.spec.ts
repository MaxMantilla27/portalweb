import { TestBed } from '@angular/core/testing';

import { FormularioPublicidadService } from './formulario-publicidad.service';

describe('FormularioPublicidadService', () => {
  let service: FormularioPublicidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormularioPublicidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
