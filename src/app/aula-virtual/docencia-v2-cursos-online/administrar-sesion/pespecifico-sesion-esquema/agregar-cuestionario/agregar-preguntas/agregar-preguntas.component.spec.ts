import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarPreguntasComponent } from './agregar-preguntas.component';

describe('AgregarPreguntasComponent', () => {
  let component: AgregarPreguntasComponent;
  let fixture: ComponentFixture<AgregarPreguntasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarPreguntasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarPreguntasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
