import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoTrabajoAplicacionProfesionalComponent } from './curso-trabajo-aplicacion-profesional.component';

describe('CursoTrabajoAplicacionProfesionalComponent', () => {
  let component: CursoTrabajoAplicacionProfesionalComponent;
  let fixture: ComponentFixture<CursoTrabajoAplicacionProfesionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursoTrabajoAplicacionProfesionalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CursoTrabajoAplicacionProfesionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
