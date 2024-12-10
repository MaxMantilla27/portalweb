import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePagoPeruIzipayComponent } from './detalle-pago-peru-izipay.component';

describe('DetallePagoPeruIzipayComponent', () => {
  let component: DetallePagoPeruIzipayComponent;
  let fixture: ComponentFixture<DetallePagoPeruIzipayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallePagoPeruIzipayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePagoPeruIzipayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
