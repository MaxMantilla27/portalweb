import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoMedioPagoDetalleComponent } from './pago-medio-pago-detalle.component';

describe('PagoMedioPagoDetalleComponent', () => {
  let component: PagoMedioPagoDetalleComponent;
  let fixture: ComponentFixture<PagoMedioPagoDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagoMedioPagoDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoMedioPagoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
