import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificadoEstudiosCarrerasProfesionalesComponent } from './certificado-estudios-carreras-profesionales.component';

describe('CertificadoEstudiosCarrerasProfesionalesComponent', () => {
  let component: CertificadoEstudiosCarrerasProfesionalesComponent;
  let fixture: ComponentFixture<CertificadoEstudiosCarrerasProfesionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificadoEstudiosCarrerasProfesionalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificadoEstudiosCarrerasProfesionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
