import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoAyudaComponent } from './video-ayuda.component';

describe('VideoAyudaComponent', () => {
  let component: VideoAyudaComponent;
  let fixture: ComponentFixture<VideoAyudaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoAyudaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoAyudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
