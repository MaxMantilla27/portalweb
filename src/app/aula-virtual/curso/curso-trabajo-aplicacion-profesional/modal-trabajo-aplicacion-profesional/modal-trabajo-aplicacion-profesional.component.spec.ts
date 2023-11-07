import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTrabajoAplicacionProfesionalComponent } from './modal-trabajo-aplicacion-profesional.component';

describe('ModalTrabajoAplicacionProfesionalComponent', () => {
  let component: ModalTrabajoAplicacionProfesionalComponent;
  let fixture: ComponentFixture<ModalTrabajoAplicacionProfesionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalTrabajoAplicacionProfesionalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTrabajoAplicacionProfesionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
