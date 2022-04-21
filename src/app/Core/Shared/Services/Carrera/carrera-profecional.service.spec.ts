import { TestBed } from '@angular/core/testing';

import { CarreraProfecionalService } from './carrera-profecional.service';

describe('CarreraProfecionalService', () => {
  let service: CarreraProfecionalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarreraProfecionalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
