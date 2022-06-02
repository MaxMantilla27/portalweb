import { TestBed } from '@angular/core/testing';

import { ProgramaEspecificoIntegraService } from './programa-especifico-integra.service';

describe('ProgramaEspecificoIntegraService', () => {
  let service: ProgramaEspecificoIntegraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgramaEspecificoIntegraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
