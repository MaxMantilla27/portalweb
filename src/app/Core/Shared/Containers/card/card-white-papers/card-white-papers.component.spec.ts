import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardWhitePapersComponent } from './card-white-papers.component';

describe('CardWhitePapersComponent', () => {
  let component: CardWhitePapersComponent;
  let fixture: ComponentFixture<CardWhitePapersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardWhitePapersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardWhitePapersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
