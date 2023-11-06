import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAsistenciaProgramaCarreraProfesionalComponent } from './gestion-asistencia-programa-carrera-profesional.component';

describe('GestionAsistenciaProgramaCarreraProfesionalComponent', () => {
  let component: GestionAsistenciaProgramaCarreraProfesionalComponent;
  let fixture: ComponentFixture<GestionAsistenciaProgramaCarreraProfesionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionAsistenciaProgramaCarreraProfesionalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionAsistenciaProgramaCarreraProfesionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
