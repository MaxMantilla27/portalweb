import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalificarTrabajoAplicacionComponent } from './calificar-trabajo-aplicacion.component';

describe('CalificarTrabajoAplicacionComponent', () => {
  let component: CalificarTrabajoAplicacionComponent;
  let fixture: ComponentFixture<CalificarTrabajoAplicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalificarTrabajoAplicacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalificarTrabajoAplicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
