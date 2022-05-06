import { TestBed } from '@angular/core/testing';

import { DatosPortalService } from './datos-portal.service';

describe('DatosPortalService', () => {
  let service: DatosPortalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatosPortalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
