import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvioActividadComponent } from './envio-actividad.component';

describe('EnvioActividadComponent', () => {
  let component: EnvioActividadComponent;
  let fixture: ComponentFixture<EnvioActividadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvioActividadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvioActividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
