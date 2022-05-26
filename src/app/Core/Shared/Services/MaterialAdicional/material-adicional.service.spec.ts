import { TestBed } from '@angular/core/testing';

import { MaterialAdicionalService } from './material-adicional.service';

describe('MaterialAdicionalService', () => {
  let service: MaterialAdicionalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaterialAdicionalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
