import { TestBed } from '@angular/core/testing';

import { RegistroWebinarService } from './registro-webinar.service';

describe('RegistroWebinarService', () => {
  let service: RegistroWebinarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegistroWebinarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
