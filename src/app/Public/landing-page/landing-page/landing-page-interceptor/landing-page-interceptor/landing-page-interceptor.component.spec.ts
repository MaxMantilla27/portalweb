import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageInterceptorComponent } from './landing-page-interceptor.component';

describe('LandingPageInterceptorComponent', () => {
  let component: LandingPageInterceptorComponent;
  let fixture: ComponentFixture<LandingPageInterceptorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingPageInterceptorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageInterceptorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
