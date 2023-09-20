import { TestBed } from '@angular/core/testing';

import { PEspecificoEsquemaService } from './pespecifico-esquema.service';

describe('PEspecificoEsquemaService', () => {
  let service: PEspecificoEsquemaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PEspecificoEsquemaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
