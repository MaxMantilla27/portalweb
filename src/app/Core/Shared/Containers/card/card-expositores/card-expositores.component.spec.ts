import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardExpositoresComponent } from './card-expositores.component';

describe('CardExpositoresComponent', () => {
  let component: CardExpositoresComponent;
  let fixture: ComponentFixture<CardExpositoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardExpositoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardExpositoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
