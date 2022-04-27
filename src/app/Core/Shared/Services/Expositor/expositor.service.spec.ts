import { TestBed } from '@angular/core/testing';

import { ExpositorService } from './expositor.service';

describe('ExpositorService', () => {
  let service: ExpositorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpositorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
