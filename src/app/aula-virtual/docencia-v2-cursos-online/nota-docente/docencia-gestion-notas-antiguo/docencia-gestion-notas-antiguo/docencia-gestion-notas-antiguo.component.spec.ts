import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaGestionNotasAntiguoComponent } from './docencia-gestion-notas-antiguo.component';

describe('DocenciaGestionNotasAntiguoComponent', () => {
  let component: DocenciaGestionNotasAntiguoComponent;
  let fixture: ComponentFixture<DocenciaGestionNotasAntiguoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaGestionNotasAntiguoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaGestionNotasAntiguoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
