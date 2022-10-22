import { TestBed } from '@angular/core/testing';

import { LandingPageV2Service } from './landing-page-v2.service';

describe('LandingPageV2Service', () => {
  let service: LandingPageV2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LandingPageV2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
