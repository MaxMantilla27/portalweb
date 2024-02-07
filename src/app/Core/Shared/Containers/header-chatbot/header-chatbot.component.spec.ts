import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderChatbotComponent } from './header-chatbot.component';

describe('HeaderChatbotComponent', () => {
  let component: HeaderChatbotComponent;
  let fixture: ComponentFixture<HeaderChatbotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderChatbotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderChatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
