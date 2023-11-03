import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoNotasCarrerasProfesionalesComponent } from './curso-notas-carreras-profesionales.component';

describe('CursoNotasCarrerasProfesionalesComponent', () => {
  let component: CursoNotasCarrerasProfesionalesComponent;
  let fixture: ComponentFixture<CursoNotasCarrerasProfesionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursoNotasCarrerasProfesionalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CursoNotasCarrerasProfesionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
