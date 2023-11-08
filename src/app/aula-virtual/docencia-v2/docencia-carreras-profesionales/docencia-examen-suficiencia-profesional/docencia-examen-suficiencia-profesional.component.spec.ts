import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaExamenSuficienciaProfesionalComponent } from './docencia-examen-suficiencia-profesional.component';

describe('DocenciaExamenSuficienciaProfesionalComponent', () => {
  let component: DocenciaExamenSuficienciaProfesionalComponent;
  let fixture: ComponentFixture<DocenciaExamenSuficienciaProfesionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaExamenSuficienciaProfesionalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaExamenSuficienciaProfesionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
