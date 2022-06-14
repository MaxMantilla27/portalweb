import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoBrightcovePruebaComponent } from './video-brightcove-prueba.component';

describe('VideoBrightcovePruebaComponent', () => {
  let component: VideoBrightcovePruebaComponent;
  let fixture: ComponentFixture<VideoBrightcovePruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoBrightcovePruebaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoBrightcovePruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
