import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFacebookIngresarComponent } from './login-facebook-ingresar.component';

describe('LoginFacebookIngresarComponent', () => {
  let component: LoginFacebookIngresarComponent;
  let fixture: ComponentFixture<LoginFacebookIngresarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginFacebookIngresarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFacebookIngresarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
