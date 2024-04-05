import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaGestionCriteriosRegistroAntiguoAgregarComponent } from './docencia-gestion-criterios-registro-antiguo-agregar.component';

describe('DocenciaGestionCriteriosRegistroAntiguoAgregarComponent', () => {
  let component: DocenciaGestionCriteriosRegistroAntiguoAgregarComponent;
  let fixture: ComponentFixture<DocenciaGestionCriteriosRegistroAntiguoAgregarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaGestionCriteriosRegistroAntiguoAgregarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaGestionCriteriosRegistroAntiguoAgregarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
