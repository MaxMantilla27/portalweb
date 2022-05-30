import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoCertificadoDigitalComponent } from './curso-certificado-digital.component';

describe('CursoCertificadoDigitalComponent', () => {
  let component: CursoCertificadoDigitalComponent;
  let fixture: ComponentFixture<CursoCertificadoDigitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursoCertificadoDigitalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CursoCertificadoDigitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
