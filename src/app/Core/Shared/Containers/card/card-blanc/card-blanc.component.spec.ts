import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardBlancComponent } from './card-blanc.component';

describe('CardBlancComponent', () => {
  let component: CardBlancComponent;
  let fixture: ComponentFixture<CardBlancComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardBlancComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardBlancComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
