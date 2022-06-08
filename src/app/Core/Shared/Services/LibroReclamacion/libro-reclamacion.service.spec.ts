import { TestBed } from '@angular/core/testing';

import { LibroReclamacionService } from './libro-reclamacion.service';

describe('LibroReclamacionService', () => {
  let service: LibroReclamacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibroReclamacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
