import { TestBed } from '@angular/core/testing';

import { DatosPerfilService } from './datos-perfil.service';

describe('DatosPerfilService', () => {
  let service: DatosPerfilService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatosPerfilService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
