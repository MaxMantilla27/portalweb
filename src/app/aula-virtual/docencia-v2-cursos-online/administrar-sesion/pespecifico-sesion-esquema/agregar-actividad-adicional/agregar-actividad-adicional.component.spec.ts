import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarActividadAdicionalComponent } from './agregar-actividad-adicional.component';

describe('AgregarActividadAdicionalComponent', () => {
  let component: AgregarActividadAdicionalComponent;
  let fixture: ComponentFixture<AgregarActividadAdicionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarActividadAdicionalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarActividadAdicionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
