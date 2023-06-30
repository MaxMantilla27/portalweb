import { TestBed } from '@angular/core/testing';

import { PerfilalumnosService } from './perfilalumnos.service';

describe('PerfilalumnosService', () => {
  let service: PerfilalumnosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PerfilalumnosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
