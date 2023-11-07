import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamenSuficienciaComponent } from './examen-suficiencia.component';

describe('ExamenSuficienciaComponent', () => {
  let component: ExamenSuficienciaComponent;
  let fixture: ComponentFixture<ExamenSuficienciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamenSuficienciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamenSuficienciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
