import { TestBed } from '@angular/core/testing';

import { ContactenosService } from './contactenos.service';

describe('ContactenosService', () => {
  let service: ContactenosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactenosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
