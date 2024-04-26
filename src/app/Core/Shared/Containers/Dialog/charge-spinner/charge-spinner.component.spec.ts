import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeSpinnerComponent } from './charge-spinner.component';

describe('ChargeSpinnerComponent', () => {
  let component: ChargeSpinnerComponent;
  let fixture: ComponentFixture<ChargeSpinnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeSpinnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeSpinnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
