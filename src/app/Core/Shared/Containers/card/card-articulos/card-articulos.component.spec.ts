import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardArticulosComponent } from './card-articulos.component';

describe('CardArticulosComponent', () => {
  let component: CardArticulosComponent;
  let fixture: ComponentFixture<CardArticulosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardArticulosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardArticulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
