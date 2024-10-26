import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotIaComponent } from './chatbot-ia.component';

describe('ChatbotIaComponent', () => {
  let component: ChatbotIaComponent;
  let fixture: ComponentFixture<ChatbotIaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatbotIaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatbotIaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
