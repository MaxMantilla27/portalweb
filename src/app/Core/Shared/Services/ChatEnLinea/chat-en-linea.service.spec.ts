import { TestBed } from '@angular/core/testing';

import { ChatEnLineaService } from './chat-en-linea.service';

describe('ChatEnLineaService', () => {
  let service: ChatEnLineaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatEnLineaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
