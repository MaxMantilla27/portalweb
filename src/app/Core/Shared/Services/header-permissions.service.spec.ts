import { TestBed } from '@angular/core/testing';

import { HeaderPermissionsService } from './header-permissions.service';

describe('HeaderPermissionsService', () => {
  let service: HeaderPermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderPermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
