import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoMedioPagoComponent } from './pago-medio-pago.component';

describe('PagoMedioPagoComponent', () => {
  let component: PagoMedioPagoComponent;
  let fixture: ComponentFixture<PagoMedioPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagoMedioPagoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoMedioPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
