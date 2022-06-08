import { TestBed } from '@angular/core/testing';

import { ProveedorGuard } from './proveedor.guard';

describe('ProveedorGuard', () => {
  let guard: ProveedorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ProveedorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
