import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPagoOpenpayColombiaOrganicoComponent } from './modal-pago-openpay-colombia-organico.component';

describe('ModalPagoOpenpayColombiaOrganicoComponent', () => {
  let component: ModalPagoOpenpayColombiaOrganicoComponent;
  let fixture: ComponentFixture<ModalPagoOpenpayColombiaOrganicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPagoOpenpayColombiaOrganicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPagoOpenpayColombiaOrganicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
