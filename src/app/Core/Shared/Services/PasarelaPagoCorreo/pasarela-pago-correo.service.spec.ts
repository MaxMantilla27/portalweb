import { TestBed } from '@angular/core/testing';

import { PasarelaPagoCorreoService } from './pasarela-pago-correo.service';

describe('PasarelaPagoCorreoService', () => {
  let service: PasarelaPagoCorreoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasarelaPagoCorreoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
