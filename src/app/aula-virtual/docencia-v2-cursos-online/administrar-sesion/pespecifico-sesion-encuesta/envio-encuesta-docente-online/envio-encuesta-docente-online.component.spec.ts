import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvioEncuestaDocenteOnlineComponent } from './envio-encuesta-docente-online.component';

describe('EnvioEncuestaDocenteOnlineComponent', () => {
  let component: EnvioEncuestaDocenteOnlineComponent;
  let fixture: ComponentFixture<EnvioEncuestaDocenteOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvioEncuestaDocenteOnlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvioEncuestaDocenteOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
