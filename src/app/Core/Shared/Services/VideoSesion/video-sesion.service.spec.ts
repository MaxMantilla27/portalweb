import { TestBed } from '@angular/core/testing';

import { VideoSesionService } from './video-sesion.service';

describe('VideoSesionService', () => {
  let service: VideoSesionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoSesionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
