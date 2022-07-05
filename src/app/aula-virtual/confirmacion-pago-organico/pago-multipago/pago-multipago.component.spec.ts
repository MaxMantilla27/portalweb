import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoMultipagoComponent } from './pago-multipago.component';

describe('PagoMultipagoComponent', () => {
  let component: PagoMultipagoComponent;
  let fixture: ComponentFixture<PagoMultipagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagoMultipagoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoMultipagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
