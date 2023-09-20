import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriterioEvaluacionDocenteComponent } from './criterio-evaluacion-docente.component';

describe('CriterioEvaluacionDocenteComponent', () => {
  let component: CriterioEvaluacionDocenteComponent;
  let fixture: ComponentFixture<CriterioEvaluacionDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CriterioEvaluacionDocenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CriterioEvaluacionDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
