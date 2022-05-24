import { TestBed } from '@angular/core/testing';

import { CrucigramaService } from './crucigrama.service';

describe('CrucigramaService', () => {
  let service: CrucigramaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrucigramaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
