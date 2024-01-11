import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPagoTarjetaMexicoComponent } from './modal-pago-tarjeta-mexico.component';

describe('ModalPagoTarjetaMexicoComponent', () => {
  let component: ModalPagoTarjetaMexicoComponent;
  let fixture: ComponentFixture<ModalPagoTarjetaMexicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPagoTarjetaMexicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPagoTarjetaMexicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
