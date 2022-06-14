import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionPagoTarjetaVisaComponent } from './confirmacion-pago-tarjeta-visa.component';

describe('ConfirmacionPagoTarjetaVisaComponent', () => {
  let component: ConfirmacionPagoTarjetaVisaComponent;
  let fixture: ComponentFixture<ConfirmacionPagoTarjetaVisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmacionPagoTarjetaVisaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacionPagoTarjetaVisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
