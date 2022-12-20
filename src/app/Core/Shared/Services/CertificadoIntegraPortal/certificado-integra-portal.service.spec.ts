import { TestBed } from '@angular/core/testing';

import { CertificadoIntegraPortalService } from './certificado-integra-portal.service';

describe('CertificadoIntegraPortalService', () => {
  let service: CertificadoIntegraPortalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CertificadoIntegraPortalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
