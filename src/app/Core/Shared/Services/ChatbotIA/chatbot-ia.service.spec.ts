import { TestBed } from '@angular/core/testing';

import { ChatbotIAService } from './chatbot-ia.service';

describe('ChatbotIAService', () => {
  let service: ChatbotIAService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatbotIAService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
