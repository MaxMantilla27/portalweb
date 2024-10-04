import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePagoInternacionalNiubizSecundarioComponent } from './detalle-pago-internacional-niubiz-secundario.component';

describe('DetallePagoInternacionalNiubizSecundarioComponent', () => {
  let component: DetallePagoInternacionalNiubizSecundarioComponent;
  let fixture: ComponentFixture<DetallePagoInternacionalNiubizSecundarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallePagoInternacionalNiubizSecundarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePagoInternacionalNiubizSecundarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
