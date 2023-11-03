import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoCertificadoCarrerasProfesionalesComponent } from './curso-certificado-carreras-profesionales.component';

describe('CursoCertificadoCarrerasProfesionalesComponent', () => {
  let component: CursoCertificadoCarrerasProfesionalesComponent;
  let fixture: ComponentFixture<CursoCertificadoCarrerasProfesionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursoCertificadoCarrerasProfesionalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CursoCertificadoCarrerasProfesionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
