import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciasCarrerasProfesionalesComponent } from './asistencias-carreras-profesionales.component';

describe('AsistenciasCarrerasProfesionalesComponent', () => {
  let component: AsistenciasCarrerasProfesionalesComponent;
  let fixture: ComponentFixture<AsistenciasCarrerasProfesionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsistenciasCarrerasProfesionalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsistenciasCarrerasProfesionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
