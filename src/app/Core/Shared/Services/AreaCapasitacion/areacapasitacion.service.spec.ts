import { TestBed } from '@angular/core/testing';

import { AreacapasitacionService } from './areacapasitacion.service';

describe('AreacapasitacionService', () => {
  let service: AreacapasitacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AreacapasitacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
