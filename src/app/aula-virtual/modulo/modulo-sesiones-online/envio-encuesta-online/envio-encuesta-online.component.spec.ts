import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvioEncuestaOnlineComponent } from './envio-encuesta-online.component';

describe('EnvioEncuestaOnlineComponent', () => {
  let component: EnvioEncuestaOnlineComponent;
  let fixture: ComponentFixture<EnvioEncuestaOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvioEncuestaOnlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvioEncuestaOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
