import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalExamenAplicacionComponent } from './modal-examen-aplicacion.component';

describe('ModalExamenAplicacionComponent', () => {
  let component: ModalExamenAplicacionComponent;
  let fixture: ComponentFixture<ModalExamenAplicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalExamenAplicacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalExamenAplicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
