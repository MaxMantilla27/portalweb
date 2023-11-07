import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCertificadoEstudiosCarrerasProfesionalesComponent } from './modal-certificado-estudios-carreras-profesionales.component';

describe('ModalCertificadoEstudiosCarrerasProfesionalesComponent', () => {
  let component: ModalCertificadoEstudiosCarrerasProfesionalesComponent;
  let fixture: ComponentFixture<ModalCertificadoEstudiosCarrerasProfesionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCertificadoEstudiosCarrerasProfesionalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCertificadoEstudiosCarrerasProfesionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
