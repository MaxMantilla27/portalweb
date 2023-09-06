import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoPagoMercadopagoComponent } from './resultado-pago-mercadopago.component';

describe('ResultadoPagoMercadopagoComponent', () => {
  let component: ResultadoPagoMercadopagoComponent;
  let fixture: ComponentFixture<ResultadoPagoMercadopagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultadoPagoMercadopagoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadoPagoMercadopagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
