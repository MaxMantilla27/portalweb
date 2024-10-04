import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePagoColombiaOpenpayComponent } from './detalle-pago-colombia-openpay.component';

describe('DetallePagoColombiaOpenpayComponent', () => {
  let component: DetallePagoColombiaOpenpayComponent;
  let fixture: ComponentFixture<DetallePagoColombiaOpenpayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallePagoColombiaOpenpayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePagoColombiaOpenpayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
