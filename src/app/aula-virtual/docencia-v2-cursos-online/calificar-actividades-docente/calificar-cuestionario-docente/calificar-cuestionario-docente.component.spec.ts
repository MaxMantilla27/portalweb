import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalificarCuestionarioDocenteComponent } from './calificar-cuestionario-docente.component';

describe('CalificarCuestionarioDocenteComponent', () => {
  let component: CalificarCuestionarioDocenteComponent;
  let fixture: ComponentFixture<CalificarCuestionarioDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalificarCuestionarioDocenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalificarCuestionarioDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
