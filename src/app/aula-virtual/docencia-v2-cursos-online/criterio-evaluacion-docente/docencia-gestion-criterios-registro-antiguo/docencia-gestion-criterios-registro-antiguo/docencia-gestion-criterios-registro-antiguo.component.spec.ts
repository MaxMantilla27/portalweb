import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaGestionCriteriosRegistroAntiguoComponent } from './docencia-gestion-criterios-registro-antiguo.component';

describe('DocenciaGestionCriteriosRegistroAntiguoComponent', () => {
  let component: DocenciaGestionCriteriosRegistroAntiguoComponent;
  let fixture: ComponentFixture<DocenciaGestionCriteriosRegistroAntiguoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaGestionCriteriosRegistroAntiguoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaGestionCriteriosRegistroAntiguoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
