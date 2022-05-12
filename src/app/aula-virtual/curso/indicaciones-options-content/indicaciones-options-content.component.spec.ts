import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicacionesOptionsContentComponent } from './indicaciones-options-content.component';

describe('IndicacionesOptionsContentComponent', () => {
  let component: IndicacionesOptionsContentComponent;
  let fixture: ComponentFixture<IndicacionesOptionsContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicacionesOptionsContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicacionesOptionsContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
