import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePagoColombiaPayuComponent } from './detalle-pago-colombia-payu.component';

describe('DetallePagoColombiaPayuComponent', () => {
  let component: DetallePagoColombiaPayuComponent;
  let fixture: ComponentFixture<DetallePagoColombiaPayuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallePagoColombiaPayuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePagoColombiaPayuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
