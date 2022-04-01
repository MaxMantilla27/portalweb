import { TestBed } from '@angular/core/testing';

import { AulaVirtualGuard } from './aula-virtual.guard';

describe('AulaVirtualGuard', () => {
  let guard: AulaVirtualGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AulaVirtualGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
