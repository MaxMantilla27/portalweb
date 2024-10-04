import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePagoInternacionalNiubizComponent } from './detalle-pago-internacional-niubiz.component';

describe('DetallePagoInternacionalNiubizComponent', () => {
  let component: DetallePagoInternacionalNiubizComponent;
  let fixture: ComponentFixture<DetallePagoInternacionalNiubizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallePagoInternacionalNiubizComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePagoInternacionalNiubizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
