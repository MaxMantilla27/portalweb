import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatBotLandingPageComponent } from './chat-bot-landing-page.component';

describe('ChatBotLandingPageComponent', () => {
  let component: ChatBotLandingPageComponent;
  let fixture: ComponentFixture<ChatBotLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatBotLandingPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatBotLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
