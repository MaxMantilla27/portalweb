import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloCalificacionesComponent } from './modulo-calificaciones.component';

describe('ModuloCalificacionesComponent', () => {
  let component: ModuloCalificacionesComponent;
  let fixture: ComponentFixture<ModuloCalificacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuloCalificacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloCalificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
