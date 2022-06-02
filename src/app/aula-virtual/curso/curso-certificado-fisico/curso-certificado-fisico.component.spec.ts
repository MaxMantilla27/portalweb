import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoCertificadoFisicoComponent } from './curso-certificado-fisico.component';

describe('CursoCertificadoFisicoComponent', () => {
  let component: CursoCertificadoFisicoComponent;
  let fixture: ComponentFixture<CursoCertificadoFisicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursoCertificadoFisicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CursoCertificadoFisicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
