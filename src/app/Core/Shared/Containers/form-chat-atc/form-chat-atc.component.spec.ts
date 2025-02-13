import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormChatAtcComponent } from './form-chat-atc.component';

describe('FormChatAtcComponent', () => {
  let component: FormChatAtcComponent;
  let fixture: ComponentFixture<FormChatAtcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormChatAtcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormChatAtcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
