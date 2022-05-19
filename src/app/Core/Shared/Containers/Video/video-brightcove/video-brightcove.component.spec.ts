import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoBrightcoveComponent } from './video-brightcove.component';

describe('VideoBrightcoveComponent', () => {
  let component: VideoBrightcoveComponent;
  let fixture: ComponentFixture<VideoBrightcoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoBrightcoveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoBrightcoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
