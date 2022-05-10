import { TestBed } from '@angular/core/testing';

import { CronogramaPagoService } from './cronograma-pago.service';

describe('CronogramaPagoService', () => {
  let service: CronogramaPagoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CronogramaPagoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
