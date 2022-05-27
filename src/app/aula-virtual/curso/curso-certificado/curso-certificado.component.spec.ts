import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoCertificadoComponent } from './curso-certificado.component';

describe('CursoCertificadoComponent', () => {
  let component: CursoCertificadoComponent;
  let fixture: ComponentFixture<CursoCertificadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursoCertificadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CursoCertificadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
