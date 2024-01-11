import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPagoMercadoPagoChileComponent } from './modal-pago-mercado-pago-chile.component';

describe('ModalPagoMercadoPagoChileComponent', () => {
  let component: ModalPagoMercadoPagoChileComponent;
  let fixture: ComponentFixture<ModalPagoMercadoPagoChileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPagoMercadoPagoChileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPagoMercadoPagoChileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
