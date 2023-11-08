import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaTrabajoAplicacionProfesionalComponent } from './docencia-trabajo-aplicacion-profesional.component';

describe('DocenciaTrabajoAplicacionProfesionalComponent', () => {
  let component: DocenciaTrabajoAplicacionProfesionalComponent;
  let fixture: ComponentFixture<DocenciaTrabajoAplicacionProfesionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaTrabajoAplicacionProfesionalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaTrabajoAplicacionProfesionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
