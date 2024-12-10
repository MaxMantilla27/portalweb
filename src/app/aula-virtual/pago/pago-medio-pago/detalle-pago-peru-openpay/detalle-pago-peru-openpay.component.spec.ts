import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePagoPeruOpenpayComponent } from './detalle-pago-peru-openpay.component';

describe('DetallePagoPeruOpenpayComponent', () => {
  let component: DetallePagoPeruOpenpayComponent;
  let fixture: ComponentFixture<DetallePagoPeruOpenpayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallePagoPeruOpenpayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePagoPeruOpenpayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
