import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalificarActividadesDocenteComponent } from './calificar-actividades-docente.component';

describe('CalificarActividadesDocenteComponent', () => {
  let component: CalificarActividadesDocenteComponent;
  let fixture: ComponentFixture<CalificarActividadesDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalificarActividadesDocenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalificarActividadesDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
