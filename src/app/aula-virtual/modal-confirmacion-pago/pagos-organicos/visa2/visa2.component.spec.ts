import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Visa2Component } from './visa2.component';

describe('Visa2Component', () => {
  let component: Visa2Component;
  let fixture: ComponentFixture<Visa2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Visa2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Visa2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
