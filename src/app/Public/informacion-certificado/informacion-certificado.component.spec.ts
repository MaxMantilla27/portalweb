import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformacionCertificadoComponent } from './informacion-certificado.component';

describe('InformacionCertificadoComponent', () => {
  let component: InformacionCertificadoComponent;
  let fixture: ComponentFixture<InformacionCertificadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformacionCertificadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformacionCertificadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
