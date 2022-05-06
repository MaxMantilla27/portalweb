import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BSCampusComponent } from './bscampus.component';

describe('BSCampusComponent', () => {
  let component: BSCampusComponent;
  let fixture: ComponentFixture<BSCampusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BSCampusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BSCampusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
