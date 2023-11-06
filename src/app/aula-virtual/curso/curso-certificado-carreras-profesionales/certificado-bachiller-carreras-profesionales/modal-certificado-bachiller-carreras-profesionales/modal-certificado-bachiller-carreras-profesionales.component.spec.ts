import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCertificadoBachillerCarrerasProfesionalesComponent } from './modal-certificado-bachiller-carreras-profesionales.component';

describe('ModalCertificadoBachillerCarrerasProfesionalesComponent', () => {
  let component: ModalCertificadoBachillerCarrerasProfesionalesComponent;
  let fixture: ComponentFixture<ModalCertificadoBachillerCarrerasProfesionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCertificadoBachillerCarrerasProfesionalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCertificadoBachillerCarrerasProfesionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
