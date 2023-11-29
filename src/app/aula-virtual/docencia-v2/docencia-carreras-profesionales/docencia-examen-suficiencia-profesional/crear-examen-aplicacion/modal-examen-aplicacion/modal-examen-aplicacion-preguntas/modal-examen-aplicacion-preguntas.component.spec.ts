import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalExamenAplicacionPreguntasComponent } from './modal-examen-aplicacion-preguntas.component';

describe('ModalExamenAplicacionPreguntasComponent', () => {
  let component: ModalExamenAplicacionPreguntasComponent;
  let fixture: ComponentFixture<ModalExamenAplicacionPreguntasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalExamenAplicacionPreguntasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalExamenAplicacionPreguntasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
