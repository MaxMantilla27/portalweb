import { TestBed } from '@angular/core/testing';

import { SeccionProgramaService } from './seccion-programa.service';

describe('SeccionProgramaService', () => {
  let service: SeccionProgramaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeccionProgramaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
