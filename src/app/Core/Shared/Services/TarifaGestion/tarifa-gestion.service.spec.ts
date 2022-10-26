import { TestBed } from '@angular/core/testing';

import { TarifaGestionService } from './tarifa-gestion.service';

describe('TareaGestionService', () => {
  let service: TarifaGestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TarifaGestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
