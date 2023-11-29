import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalificarExamenAplicacionDetalleComponent } from './calificar-examen-aplicacion-detalle.component';

describe('CalificarExamenAplicacionDetalleComponent', () => {
  let component: CalificarExamenAplicacionDetalleComponent;
  let fixture: ComponentFixture<CalificarExamenAplicacionDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalificarExamenAplicacionDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalificarExamenAplicacionDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
