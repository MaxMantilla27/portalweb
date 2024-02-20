import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPagoOpenpayPeruComponent } from './modal-pago-openpay-peru.component';

describe('ModalPagoOpenpayPeruComponent', () => {
  let component: ModalPagoOpenpayPeruComponent;
  let fixture: ComponentFixture<ModalPagoOpenpayPeruComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPagoOpenpayPeruComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPagoOpenpayPeruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
