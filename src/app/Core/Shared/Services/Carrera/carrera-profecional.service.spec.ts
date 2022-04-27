import { TestBed } from '@angular/core/testing';

import { CarreraProfesionalService } from './carrera-profesional.service';

describe('CarreraProfecionalService', () => {
  let service: CarreraProfecionalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarreraProfesionalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
