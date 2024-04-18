import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPagoTarjetaComponent } from './modal-pago-tarjeta.component';

describe('ModalPagoTarjetaComponent', () => {
  let component: ModalPagoTarjetaComponent;
  let fixture: ComponentFixture<ModalPagoTarjetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPagoTarjetaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPagoTarjetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
