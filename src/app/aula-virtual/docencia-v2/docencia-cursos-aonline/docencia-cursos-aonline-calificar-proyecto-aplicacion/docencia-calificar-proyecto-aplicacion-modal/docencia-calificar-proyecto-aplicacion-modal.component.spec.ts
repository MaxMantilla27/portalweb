import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaCalificarProyectoAplicacionModalComponent } from './docencia-calificar-proyecto-aplicacion-modal.component';

describe('DocenciaCalificarProyectoAplicacionModalComponent', () => {
  let component: DocenciaCalificarProyectoAplicacionModalComponent;
  let fixture: ComponentFixture<DocenciaCalificarProyectoAplicacionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaCalificarProyectoAplicacionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaCalificarProyectoAplicacionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
