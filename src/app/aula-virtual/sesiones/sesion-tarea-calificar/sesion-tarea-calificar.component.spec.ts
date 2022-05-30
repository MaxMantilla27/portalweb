import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SesionTareaCalificarComponent } from './sesion-tarea-calificar.component';

describe('SesionTareaCalificarComponent', () => {
  let component: SesionTareaCalificarComponent;
  let fixture: ComponentFixture<SesionTareaCalificarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SesionTareaCalificarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SesionTareaCalificarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
