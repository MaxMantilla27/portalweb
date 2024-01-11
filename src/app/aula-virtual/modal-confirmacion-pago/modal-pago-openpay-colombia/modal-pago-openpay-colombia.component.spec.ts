import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPagoOpenpayColombiaComponent } from './modal-pago-openpay-colombia.component';

describe('ModalPagoOpenpayColombiaComponent', () => {
  let component: ModalPagoOpenpayColombiaComponent;
  let fixture: ComponentFixture<ModalPagoOpenpayColombiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPagoOpenpayColombiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPagoOpenpayColombiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
