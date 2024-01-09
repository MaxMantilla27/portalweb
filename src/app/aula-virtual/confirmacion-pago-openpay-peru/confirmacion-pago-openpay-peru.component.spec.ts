import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionPagoOpenpayPeruComponent } from './confirmacion-pago-openpay-peru.component';

describe('ConfirmacionPagoOpenpayPeruComponent', () => {
  let component: ConfirmacionPagoOpenpayPeruComponent;
  let fixture: ComponentFixture<ConfirmacionPagoOpenpayPeruComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmacionPagoOpenpayPeruComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacionPagoOpenpayPeruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
