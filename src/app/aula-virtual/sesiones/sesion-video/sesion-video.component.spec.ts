import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SesionVideoComponent } from './sesion-video.component';

describe('SesionVideoComponent', () => {
  let component: SesionVideoComponent;
  let fixture: ComponentFixture<SesionVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SesionVideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SesionVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
