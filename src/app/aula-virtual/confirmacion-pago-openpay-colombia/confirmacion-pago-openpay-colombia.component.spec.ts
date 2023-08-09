import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionPagoOpenpayColombiaComponent } from './confirmacion-pago-openpay-colombia.component';

describe('ConfirmacionPagoOpenpayColombiaComponent', () => {
  let component: ConfirmacionPagoOpenpayColombiaComponent;
  let fixture: ComponentFixture<ConfirmacionPagoOpenpayColombiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmacionPagoOpenpayColombiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacionPagoOpenpayColombiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
