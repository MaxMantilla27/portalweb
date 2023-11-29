import { TestBed } from '@angular/core/testing';

import { PEspecificoCarreraTrabajoService } from './pespecifico-carrera-trabajo.service';

describe('PEspecificoCarreraTrabajoService', () => {
  let service: PEspecificoCarreraTrabajoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PEspecificoCarreraTrabajoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
