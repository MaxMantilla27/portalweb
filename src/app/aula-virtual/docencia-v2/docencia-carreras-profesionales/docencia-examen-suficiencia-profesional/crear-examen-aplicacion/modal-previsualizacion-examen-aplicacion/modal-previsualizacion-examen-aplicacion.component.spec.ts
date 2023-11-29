import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPrevisualizacionExamenAplicacionComponent } from './modal-previsualizacion-examen-aplicacion.component';

describe('ModalPrevisualizacionExamenAplicacionComponent', () => {
  let component: ModalPrevisualizacionExamenAplicacionComponent;
  let fixture: ComponentFixture<ModalPrevisualizacionExamenAplicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPrevisualizacionExamenAplicacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPrevisualizacionExamenAplicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
