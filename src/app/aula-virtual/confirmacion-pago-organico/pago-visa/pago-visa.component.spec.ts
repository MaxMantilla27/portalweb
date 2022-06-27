import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoVisaComponent } from './pago-visa.component';

describe('PagoVisaComponent', () => {
  let component: PagoVisaComponent;
  let fixture: ComponentFixture<PagoVisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagoVisaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoVisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
