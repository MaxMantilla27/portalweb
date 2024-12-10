import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoPagoNiubizComponent } from './resultado-pago-niubiz.component';

describe('ResultadoPagoNiubizComponent', () => {
  let component: ResultadoPagoNiubizComponent;
  let fixture: ComponentFixture<ResultadoPagoNiubizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultadoPagoNiubizComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadoPagoNiubizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
