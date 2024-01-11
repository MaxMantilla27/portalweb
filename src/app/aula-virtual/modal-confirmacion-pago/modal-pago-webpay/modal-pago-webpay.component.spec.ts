import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPagoWebpayComponent } from './modal-pago-webpay.component';

describe('ModalPagoWebpayComponent', () => {
  let component: ModalPagoWebpayComponent;
  let fixture: ComponentFixture<ModalPagoWebpayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPagoWebpayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPagoWebpayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
