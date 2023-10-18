import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionPagoMercadoPagoChileComponent } from './confirmacion-pago-mercado-pago-chile.component';

describe('ConfirmacionPagoMercadoPagoChileComponent', () => {
  let component: ConfirmacionPagoMercadoPagoChileComponent;
  let fixture: ComponentFixture<ConfirmacionPagoMercadoPagoChileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmacionPagoMercadoPagoChileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacionPagoMercadoPagoChileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
