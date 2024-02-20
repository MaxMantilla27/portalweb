import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPagoVisaOrganicoComponent } from './modal-pago-visa-organico.component';

describe('ModalPagoVisaOrganicoComponent', () => {
  let component: ModalPagoVisaOrganicoComponent;
  let fixture: ComponentFixture<ModalPagoVisaOrganicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPagoVisaOrganicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPagoVisaOrganicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
