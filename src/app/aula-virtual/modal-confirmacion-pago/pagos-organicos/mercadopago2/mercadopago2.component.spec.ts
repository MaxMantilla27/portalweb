import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mercadopago2Component } from './mercadopago2.component';

describe('Mercadopago2Component', () => {
  let component: Mercadopago2Component;
  let fixture: ComponentFixture<Mercadopago2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Mercadopago2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Mercadopago2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
