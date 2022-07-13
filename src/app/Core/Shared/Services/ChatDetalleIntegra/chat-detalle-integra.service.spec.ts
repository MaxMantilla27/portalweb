import { TestBed } from '@angular/core/testing';

import { ChatDetalleIntegraService } from './chat-detalle-integra.service';

describe('ChatDetalleIntegraService', () => {
  let service: ChatDetalleIntegraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatDetalleIntegraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
