import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPagoVisaComponent } from './modal-pago-visa.component';

describe('ModalPagoVisaComponent', () => {
  let component: ModalPagoVisaComponent;
  let fixture: ComponentFixture<ModalPagoVisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPagoVisaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPagoVisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
