import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoPagoComponent } from './resultado-pago.component';

describe('ResultadoPagoComponent', () => {
  let component: ResultadoPagoComponent;
  let fixture: ComponentFixture<ResultadoPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultadoPagoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadoPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
