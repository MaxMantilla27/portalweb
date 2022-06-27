import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoConektaComponent } from './pago-conekta.component';

describe('PagoConektaComponent', () => {
  let component: PagoConektaComponent;
  let fixture: ComponentFixture<PagoConektaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagoConektaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoConektaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
