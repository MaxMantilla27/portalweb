import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TramitesCertificadoIdiomaComponent } from './tramites-certificado-idioma.component';

describe('TramitesCertificadoIdiomaComponent', () => {
  let component: TramitesCertificadoIdiomaComponent;
  let fixture: ComponentFixture<TramitesCertificadoIdiomaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TramitesCertificadoIdiomaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TramitesCertificadoIdiomaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
