import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPagoConektaComponent } from './modal-pago-conekta.component';

describe('ModalPagoConektaComponent', () => {
  let component: ModalPagoConektaComponent;
  let fixture: ComponentFixture<ModalPagoConektaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPagoConektaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPagoConektaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
