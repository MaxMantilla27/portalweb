import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePagoColombiaWompiComponent } from './detalle-pago-colombia-wompi.component';

describe('DetallePagoColombiaWompiComponent', () => {
  let component: DetallePagoColombiaWompiComponent;
  let fixture: ComponentFixture<DetallePagoColombiaWompiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallePagoColombiaWompiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePagoColombiaWompiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
