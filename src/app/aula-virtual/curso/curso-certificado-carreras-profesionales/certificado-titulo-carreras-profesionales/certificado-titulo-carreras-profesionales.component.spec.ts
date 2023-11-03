import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificadoTituloCarrerasProfesionalesComponent } from './certificado-titulo-carreras-profesionales.component';

describe('CertificadoTituloCarrerasProfesionalesComponent', () => {
  let component: CertificadoTituloCarrerasProfesionalesComponent;
  let fixture: ComponentFixture<CertificadoTituloCarrerasProfesionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificadoTituloCarrerasProfesionalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificadoTituloCarrerasProfesionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
