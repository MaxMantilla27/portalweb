import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadVerticalComponent } from './load-vertical.component';

describe('LoadVerticalComponent', () => {
  let component: LoadVerticalComponent;
  let fixture: ComponentFixture<LoadVerticalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadVerticalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
