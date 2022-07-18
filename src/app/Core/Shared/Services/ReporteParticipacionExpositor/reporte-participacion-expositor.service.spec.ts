import { TestBed } from '@angular/core/testing';

import { ReporteParticipacionExpositorService } from './reporte-participacion-expositor.service';

describe('ReporteParticipacionExpositorService', () => {
  let service: ReporteParticipacionExpositorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReporteParticipacionExpositorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
