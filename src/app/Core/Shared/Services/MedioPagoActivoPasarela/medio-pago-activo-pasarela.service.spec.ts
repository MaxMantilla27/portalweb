import { TestBed } from '@angular/core/testing';

import { MedioPagoActivoPasarelaService } from './medio-pago-activo-pasarela.service';

describe('MedioPagoActivoPasarelaService', () => {
  let service: MedioPagoActivoPasarelaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedioPagoActivoPasarelaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
