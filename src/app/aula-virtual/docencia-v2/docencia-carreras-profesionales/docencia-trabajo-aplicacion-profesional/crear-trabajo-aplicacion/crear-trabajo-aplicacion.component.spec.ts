import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearTrabajoAplicacionComponent } from './crear-trabajo-aplicacion.component';

describe('CrearTrabajoAplicacionComponent', () => {
  let component: CrearTrabajoAplicacionComponent;
  let fixture: ComponentFixture<CrearTrabajoAplicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearTrabajoAplicacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearTrabajoAplicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
