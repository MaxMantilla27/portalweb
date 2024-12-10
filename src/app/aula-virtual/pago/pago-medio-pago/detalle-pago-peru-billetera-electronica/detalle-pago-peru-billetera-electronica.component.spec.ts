import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePagoPeruBilleteraElectronicaComponent } from './detalle-pago-peru-billetera-electronica.component';

describe('DetallePagoPeruBilleteraElectronicaComponent', () => {
  let component: DetallePagoPeruBilleteraElectronicaComponent;
  let fixture: ComponentFixture<DetallePagoPeruBilleteraElectronicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallePagoPeruBilleteraElectronicaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePagoPeruBilleteraElectronicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
