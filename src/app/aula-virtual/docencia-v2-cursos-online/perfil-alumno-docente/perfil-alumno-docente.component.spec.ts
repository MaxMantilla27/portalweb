import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilAlumnoDocenteComponent } from './perfil-alumno-docente.component';

describe('PerfilAlumnoDocenteComponent', () => {
  let component: PerfilAlumnoDocenteComponent;
  let fixture: ComponentFixture<PerfilAlumnoDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerfilAlumnoDocenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilAlumnoDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
