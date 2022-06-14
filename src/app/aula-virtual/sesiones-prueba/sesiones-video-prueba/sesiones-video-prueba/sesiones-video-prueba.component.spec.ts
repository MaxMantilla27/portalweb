import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SesionesVideoPruebaComponent } from './sesiones-video-prueba.component';

describe('SesionesVideoPruebaComponent', () => {
  let component: SesionesVideoPruebaComponent;
  let fixture: ComponentFixture<SesionesVideoPruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SesionesVideoPruebaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SesionesVideoPruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
