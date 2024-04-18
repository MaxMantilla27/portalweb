import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Multipago2Component } from './multipago2.component';

describe('Multipago2Component', () => {
  let component: Multipago2Component;
  let fixture: ComponentFixture<Multipago2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Multipago2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Multipago2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
