import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearExamenAplicacionComponent } from './crear-examen-aplicacion.component';

describe('CrearExamenAplicacionComponent', () => {
  let component: CrearExamenAplicacionComponent;
  let fixture: ComponentFixture<CrearExamenAplicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrearExamenAplicacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearExamenAplicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
