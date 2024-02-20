import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Webpay2Component } from './webpay2.component';

describe('Webpay2Component', () => {
  let component: Webpay2Component;
  let fixture: ComponentFixture<Webpay2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Webpay2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Webpay2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
