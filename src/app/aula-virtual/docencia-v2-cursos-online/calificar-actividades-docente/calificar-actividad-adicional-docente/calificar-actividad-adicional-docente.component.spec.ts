import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalificarActividadAdicionalDocenteComponent } from './calificar-actividad-adicional-docente.component';

describe('CalificarActividadAdicionalDocenteComponent', () => {
  let component: CalificarActividadAdicionalDocenteComponent;
  let fixture: ComponentFixture<CalificarActividadAdicionalDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalificarActividadAdicionalDocenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalificarActividadAdicionalDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
