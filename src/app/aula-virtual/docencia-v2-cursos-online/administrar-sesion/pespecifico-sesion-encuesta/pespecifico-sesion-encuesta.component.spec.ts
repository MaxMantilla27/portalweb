import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PespecificoSesionEncuestaComponent } from './pespecifico-sesion-encuesta.component';

describe('PespecificoSesionEncuestaComponent', () => {
  let component: PespecificoSesionEncuestaComponent;
  let fixture: ComponentFixture<PespecificoSesionEncuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PespecificoSesionEncuestaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PespecificoSesionEncuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
