import { TestBed } from '@angular/core/testing';

import { PoliticaPrivacidadService } from './politica-privacidad.service';

describe('PoliticaPrivacidadService', () => {
  let service: PoliticaPrivacidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoliticaPrivacidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
