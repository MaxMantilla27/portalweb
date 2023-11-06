import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCertificadoTituloCarrerasProfesionalesComponent } from './modal-certificado-titulo-carreras-profesionales.component';

describe('ModalCertificadoTituloCarrerasProfesionalesComponent', () => {
  let component: ModalCertificadoTituloCarrerasProfesionalesComponent;
  let fixture: ComponentFixture<ModalCertificadoTituloCarrerasProfesionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCertificadoTituloCarrerasProfesionalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCertificadoTituloCarrerasProfesionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
