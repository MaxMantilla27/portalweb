import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AprovacionComponent } from './aprovacion.component';

describe('AprovacionComponent', () => {
  let component: AprovacionComponent;
  let fixture: ComponentFixture<AprovacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AprovacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AprovacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
