import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPagoIzipayComponent } from './modal-pago-izipay.component';

describe('ModalPagoIzipayComponent', () => {
  let component: ModalPagoIzipayComponent;
  let fixture: ComponentFixture<ModalPagoIzipayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPagoIzipayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPagoIzipayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
