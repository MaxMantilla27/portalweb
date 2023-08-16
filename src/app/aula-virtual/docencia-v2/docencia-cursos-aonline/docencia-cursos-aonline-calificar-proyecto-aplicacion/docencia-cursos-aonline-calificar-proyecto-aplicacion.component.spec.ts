import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaCursosAonlineCalificarProyectoAplicacionComponent } from './docencia-cursos-aonline-calificar-proyecto-aplicacion.component';

describe('DocenciaCursosAonlineCalificarProyectoAplicacionComponent', () => {
  let component: DocenciaCursosAonlineCalificarProyectoAplicacionComponent;
  let fixture: ComponentFixture<DocenciaCursosAonlineCalificarProyectoAplicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaCursosAonlineCalificarProyectoAplicacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaCursosAonlineCalificarProyectoAplicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
