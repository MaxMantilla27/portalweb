import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFacebookRegistrarComponent } from './login-facebook-registrar.component';

describe('LoginFacebookRegistrarComponent', () => {
  let component: LoginFacebookRegistrarComponent;
  let fixture: ComponentFixture<LoginFacebookRegistrarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginFacebookRegistrarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFacebookRegistrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
