import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloAyudaPreguntasFrecuentesComponent } from './modulo-ayuda-preguntas-frecuentes.component';

describe('ModuloAyudaPreguntasFrecuentesComponent', () => {
  let component: ModuloAyudaPreguntasFrecuentesComponent;
  let fixture: ComponentFixture<ModuloAyudaPreguntasFrecuentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuloAyudaPreguntasFrecuentesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloAyudaPreguntasFrecuentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
