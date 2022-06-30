import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionPagoTarjetaConektaComponent } from './confirmacion-pago-tarjeta-conekta.component';

describe('ConfirmacionPagoTarjetaConektaComponent', () => {
  let component: ConfirmacionPagoTarjetaConektaComponent;
  let fixture: ComponentFixture<ConfirmacionPagoTarjetaConektaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmacionPagoTarjetaConektaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacionPagoTarjetaConektaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
