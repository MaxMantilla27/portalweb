import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEnvioTareaComponent } from './modal-envio-tarea.component';

describe('ModalEnvioTareaComponent', () => {
  let component: ModalEnvioTareaComponent;
  let fixture: ComponentFixture<ModalEnvioTareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalEnvioTareaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalEnvioTareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
