import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginATCComponent } from './login-atc.component';

describe('LoginATCComponent', () => {
  let component: LoginATCComponent;
  let fixture: ComponentFixture<LoginATCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginATCComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginATCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
