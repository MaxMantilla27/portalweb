import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicacionesContentComponent } from './indicaciones-content.component';

describe('IndicacionesContentComponent', () => {
  let component: IndicacionesContentComponent;
  let fixture: ComponentFixture<IndicacionesContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicacionesContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicacionesContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
