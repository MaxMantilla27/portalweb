import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaActividadesAutoevaluacionComponent } from './docencia-actividades-autoevaluacion.component';

describe('DocenciaActividadesAutoevaluacionComponent', () => {
  let component: DocenciaActividadesAutoevaluacionComponent;
  let fixture: ComponentFixture<DocenciaActividadesAutoevaluacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaActividadesAutoevaluacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaActividadesAutoevaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
