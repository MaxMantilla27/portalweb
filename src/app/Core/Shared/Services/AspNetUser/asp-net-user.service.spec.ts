import { TestBed } from '@angular/core/testing';

import { AspNetUserService } from './asp-net-user.service';

describe('AspNetUserService', () => {
  let service: AspNetUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AspNetUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
