import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLearningComponent } from './home-learning.component';

describe('HomeLearningComponent', () => {
  let component: HomeLearningComponent;
  let fixture: ComponentFixture<HomeLearningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeLearningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
