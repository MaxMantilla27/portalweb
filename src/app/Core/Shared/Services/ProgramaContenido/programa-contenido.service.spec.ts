import { TestBed } from '@angular/core/testing';

import { ProgramaContenidoService } from './programa-contenido.service';

describe('ProgramaContenidoService', () => {
  let service: ProgramaContenidoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgramaContenidoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
