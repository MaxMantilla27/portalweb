import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalificarExamenAplicacionComponent } from './calificar-examen-aplicacion.component';

describe('CalificarExamenAplicacionComponent', () => {
  let component: CalificarExamenAplicacionComponent;
  let fixture: ComponentFixture<CalificarExamenAplicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalificarExamenAplicacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalificarExamenAplicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
