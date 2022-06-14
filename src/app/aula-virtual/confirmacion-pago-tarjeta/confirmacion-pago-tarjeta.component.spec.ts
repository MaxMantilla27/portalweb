import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionPagoTarjetaComponent } from './confirmacion-pago-tarjeta.component';

describe('ConfirmacionPagoTarjetaComponent', () => {
  let component: ConfirmacionPagoTarjetaComponent;
  let fixture: ComponentFixture<ConfirmacionPagoTarjetaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmacionPagoTarjetaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacionPagoTarjetaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
