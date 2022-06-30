import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionPagoTarjetaWompiComponent } from './confirmacion-pago-tarjeta-wompi.component';

describe('ConfirmacionPagoTarjetaWompiComponent', () => {
  let component: ConfirmacionPagoTarjetaWompiComponent;
  let fixture: ComponentFixture<ConfirmacionPagoTarjetaWompiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmacionPagoTarjetaWompiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacionPagoTarjetaWompiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
