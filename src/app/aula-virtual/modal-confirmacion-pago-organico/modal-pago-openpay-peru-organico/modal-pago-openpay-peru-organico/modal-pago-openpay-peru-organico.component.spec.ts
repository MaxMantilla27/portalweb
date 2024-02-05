import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPagoOpenpayPeruOrganicoComponent } from './modal-pago-openpay-peru-organico.component';

describe('ModalPagoOpenpayPeruOrganicoComponent', () => {
  let component: ModalPagoOpenpayPeruOrganicoComponent;
  let fixture: ComponentFixture<ModalPagoOpenpayPeruOrganicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPagoOpenpayPeruOrganicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPagoOpenpayPeruOrganicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
