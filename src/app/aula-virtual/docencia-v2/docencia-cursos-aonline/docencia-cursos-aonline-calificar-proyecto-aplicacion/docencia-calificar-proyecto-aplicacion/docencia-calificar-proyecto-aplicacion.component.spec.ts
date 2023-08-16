import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaCalificarProyectoAplicacionComponent } from './docencia-calificar-proyecto-aplicacion.component';

describe('DocenciaCalificarProyectoAplicacionComponent', () => {
  let component: DocenciaCalificarProyectoAplicacionComponent;
  let fixture: ComponentFixture<DocenciaCalificarProyectoAplicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaCalificarProyectoAplicacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaCalificarProyectoAplicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
