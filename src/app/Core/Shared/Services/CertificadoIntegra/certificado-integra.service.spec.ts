import { TestBed } from '@angular/core/testing';

import { CertificadoIntegraService } from './certificado-integra.service';

describe('CertificadoIntegraService', () => {
  let service: CertificadoIntegraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CertificadoIntegraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
