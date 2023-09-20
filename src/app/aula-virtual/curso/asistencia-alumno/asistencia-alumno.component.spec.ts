import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciaAlumnoComponent } from './asistencia-alumno.component';

describe('AsistenciaAlumnoComponent', () => {
  let component: AsistenciaAlumnoComponent;
  let fixture: ComponentFixture<AsistenciaAlumnoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsistenciaAlumnoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsistenciaAlumnoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
