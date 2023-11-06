import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TramitesCertificadoEstudiosComponent } from './tramites-certificado-estudios.component';

describe('TramitesCertificadoEstudiosComponent', () => {
  let component: TramitesCertificadoEstudiosComponent;
  let fixture: ComponentFixture<TramitesCertificadoEstudiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TramitesCertificadoEstudiosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TramitesCertificadoEstudiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
