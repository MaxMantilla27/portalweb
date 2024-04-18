import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPagoWebpayOrganicoComponent } from './modal-pago-webpay-organico.component';

describe('ModalPagoWebpayOrganicoComponent', () => {
  let component: ModalPagoWebpayOrganicoComponent;
  let fixture: ComponentFixture<ModalPagoWebpayOrganicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPagoWebpayOrganicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPagoWebpayOrganicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
