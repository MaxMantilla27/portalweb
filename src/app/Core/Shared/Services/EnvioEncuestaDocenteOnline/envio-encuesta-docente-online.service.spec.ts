import { TestBed } from '@angular/core/testing';

import { EnvioEncuestaDocenteOnlineService } from './envio-encuesta-docente-online.service';

describe('EnvioEncuestaDocenteOnlineService', () => {
  let service: EnvioEncuestaDocenteOnlineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvioEncuestaDocenteOnlineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
