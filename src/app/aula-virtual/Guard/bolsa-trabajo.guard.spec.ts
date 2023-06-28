import { TestBed } from '@angular/core/testing';

import { BolsaTrabajoGuard } from './bolsa-trabajo.guard';

describe('BolsaTrabajoGuard', () => {
  let guard: BolsaTrabajoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BolsaTrabajoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
