import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeWordComponent } from './change-word.component';

describe('ChangeWordComponent', () => {
  let component: ChangeWordComponent;
  let fixture: ComponentFixture<ChangeWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeWordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
