import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePagoChileMercadopagoComponent } from './detalle-pago-chile-mercadopago.component';

describe('DetallePagoChileMercadopagoComponent', () => {
  let component: DetallePagoChileMercadopagoComponent;
  let fixture: ComponentFixture<DetallePagoChileMercadopagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallePagoChileMercadopagoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePagoChileMercadopagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
