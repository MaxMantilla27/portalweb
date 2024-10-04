import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePagoChileWebpayComponent } from './detalle-pago-chile-webpay.component';

describe('DetallePagoChileWebpayComponent', () => {
  let component: DetallePagoChileWebpayComponent;
  let fixture: ComponentFixture<DetallePagoChileWebpayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallePagoChileWebpayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePagoChileWebpayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
