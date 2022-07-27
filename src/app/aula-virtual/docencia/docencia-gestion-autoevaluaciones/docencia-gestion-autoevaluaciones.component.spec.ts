import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaGestionAutoevaluacionesComponent } from './docencia-gestion-autoevaluaciones.component';

describe('DocenciaGestionAutoevaluacionesComponent', () => {
  let component: DocenciaGestionAutoevaluacionesComponent;
  let fixture: ComponentFixture<DocenciaGestionAutoevaluacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaGestionAutoevaluacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaGestionAutoevaluacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
