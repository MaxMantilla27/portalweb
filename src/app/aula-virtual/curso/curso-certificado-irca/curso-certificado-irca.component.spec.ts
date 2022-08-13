import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoCertificadoIrcaComponent } from './curso-certificado-irca.component';

describe('CursoCertificadoIrcaComponent', () => {
  let component: CursoCertificadoIrcaComponent;
  let fixture: ComponentFixture<CursoCertificadoIrcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursoCertificadoIrcaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CursoCertificadoIrcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
