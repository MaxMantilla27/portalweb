import { TestBed } from '@angular/core/testing';

import { ChatAtencionClienteService } from './chat-atencion-cliente.service';

describe('ChatAtencionClienteService', () => {
  let service: ChatAtencionClienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatAtencionClienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
