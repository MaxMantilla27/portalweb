import { TestBed } from '@angular/core/testing';

import { TerminosCondicionesService } from './terminos-condiciones.service';

describe('TerminosCondicionesService', () => {
  let service: TerminosCondicionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TerminosCondicionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
