import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePagoPeruNiubizSecundarioComponent } from './detalle-pago-peru-niubiz-secundario.component';

describe('DetallePagoPeruNiubizSecundarioComponent', () => {
  let component: DetallePagoPeruNiubizSecundarioComponent;
  let fixture: ComponentFixture<DetallePagoPeruNiubizSecundarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallePagoPeruNiubizSecundarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePagoPeruNiubizSecundarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
