import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoModulosCarrerasProfesionalesComponent } from './curso-modulos-carreras-profesionales.component';

describe('CursoModulosCarrerasProfesionalesComponent', () => {
  let component: CursoModulosCarrerasProfesionalesComponent;
  let fixture: ComponentFixture<CursoModulosCarrerasProfesionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursoModulosCarrerasProfesionalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CursoModulosCarrerasProfesionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
