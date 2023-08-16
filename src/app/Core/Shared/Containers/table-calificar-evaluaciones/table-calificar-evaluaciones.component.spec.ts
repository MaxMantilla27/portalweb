import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCalificarEvaluacionesComponent } from './table-calificar-evaluaciones.component';

describe('TableCalificarEvaluacionesComponent', () => {
  let component: TableCalificarEvaluacionesComponent;
  let fixture: ComponentFixture<TableCalificarEvaluacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableCalificarEvaluacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableCalificarEvaluacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
