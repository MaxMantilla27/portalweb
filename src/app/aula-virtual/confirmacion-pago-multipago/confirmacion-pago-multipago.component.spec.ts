import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionPagoMultipagoComponent } from './confirmacion-pago-multipago.component';

describe('ConfirmacionPagoMultipagoComponent', () => {
  let component: ConfirmacionPagoMultipagoComponent;
  let fixture: ComponentFixture<ConfirmacionPagoMultipagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmacionPagoMultipagoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacionPagoMultipagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
