import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeTextComponent } from './charge-text.component';

describe('ChargeTextComponent', () => {
  let component: ChargeTextComponent;
  let fixture: ComponentFixture<ChargeTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargeTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
