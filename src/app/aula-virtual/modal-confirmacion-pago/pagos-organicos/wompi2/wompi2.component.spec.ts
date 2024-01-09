import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Wompi2Component } from './wompi2.component';

describe('Wompi2Component', () => {
  let component: Wompi2Component;
  let fixture: ComponentFixture<Wompi2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Wompi2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Wompi2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
