import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoMercadoPagoComponent } from './pago-mercado-pago.component';

describe('PagoMercadoPagoComponent', () => {
  let component: PagoMercadoPagoComponent;
  let fixture: ComponentFixture<PagoMercadoPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagoMercadoPagoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoMercadoPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
