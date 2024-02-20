import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPagoMultipagoComponent } from './modal-pago-multipago.component';

describe('ModalPagoMultipagoComponent', () => {
  let component: ModalPagoMultipagoComponent;
  let fixture: ComponentFixture<ModalPagoMultipagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPagoMultipagoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPagoMultipagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
