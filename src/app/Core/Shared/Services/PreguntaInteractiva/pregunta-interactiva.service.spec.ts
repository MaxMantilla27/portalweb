import { TestBed } from '@angular/core/testing';

import { PreguntaInteractivaService } from './pregunta-interactiva.service';

describe('PreguntaInteractivaService', () => {
  let service: PreguntaInteractivaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreguntaInteractivaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
