import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Conekta2Component } from './conekta2.component';

describe('Conekta2Component', () => {
  let component: Conekta2Component;
  let fixture: ComponentFixture<Conekta2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Conekta2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Conekta2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
