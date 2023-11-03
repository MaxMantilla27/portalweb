import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCertificadoCarrerasComponent } from './card-certificado-carreras.component';

describe('CardCertificadoCarrerasComponent', () => {
  let component: CardCertificadoCarrerasComponent;
  let fixture: ComponentFixture<CardCertificadoCarrerasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardCertificadoCarrerasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardCertificadoCarrerasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
