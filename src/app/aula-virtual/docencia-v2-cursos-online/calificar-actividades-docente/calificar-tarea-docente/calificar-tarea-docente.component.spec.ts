import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalificarTareaDocenteComponent } from './calificar-tarea-docente.component';

describe('CalificarTareaDocenteComponent', () => {
  let component: CalificarTareaDocenteComponent;
  let fixture: ComponentFixture<CalificarTareaDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalificarTareaDocenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalificarTareaDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
