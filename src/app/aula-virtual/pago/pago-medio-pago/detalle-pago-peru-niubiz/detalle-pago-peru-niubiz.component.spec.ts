import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePagoPeruNiubizComponent } from './detalle-pago-peru-niubiz.component';

describe('DetallePagoPeruNiubizComponent', () => {
  let component: DetallePagoPeruNiubizComponent;
  let fixture: ComponentFixture<DetallePagoPeruNiubizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallePagoPeruNiubizComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePagoPeruNiubizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
