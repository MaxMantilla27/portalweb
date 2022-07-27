import { TestBed } from '@angular/core/testing';

import { TrabajoDeParesIntegraService } from './trabajo-de-pares-integra.service';

describe('TrabajoDeParesIntegraService', () => {
  let service: TrabajoDeParesIntegraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrabajoDeParesIntegraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
