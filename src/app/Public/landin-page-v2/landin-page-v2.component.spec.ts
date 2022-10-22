import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandinPageV2Component } from './landin-page-v2.component';

describe('LandinPageV2Component', () => {
  let component: LandinPageV2Component;
  let fixture: ComponentFixture<LandinPageV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandinPageV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandinPageV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
