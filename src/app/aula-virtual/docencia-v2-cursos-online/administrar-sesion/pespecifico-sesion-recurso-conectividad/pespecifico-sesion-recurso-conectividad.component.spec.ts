import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PespecificoSesionRecursoConectividadComponent } from './pespecifico-sesion-recurso-conectividad.component';

describe('PespecificoSesionRecursoConectividadComponent', () => {
  let component: PespecificoSesionRecursoConectividadComponent;
  let fixture: ComponentFixture<PespecificoSesionRecursoConectividadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PespecificoSesionRecursoConectividadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PespecificoSesionRecursoConectividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
