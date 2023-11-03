import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificadoBachillerCarrerasProfesionalesComponent } from './certificado-bachiller-carreras-profesionales.component';

describe('CertificadoBachillerCarrerasProfesionalesComponent', () => {
  let component: CertificadoBachillerCarrerasProfesionalesComponent;
  let fixture: ComponentFixture<CertificadoBachillerCarrerasProfesionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificadoBachillerCarrerasProfesionalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificadoBachillerCarrerasProfesionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
