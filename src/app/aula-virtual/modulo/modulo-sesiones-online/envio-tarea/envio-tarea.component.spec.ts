import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvioTareaComponent } from './envio-tarea.component';

describe('EnvioTareaComponent', () => {
  let component: EnvioTareaComponent;
  let fixture: ComponentFixture<EnvioTareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvioTareaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvioTareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
