import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPreguntasCuestionarioComponent } from './ver-preguntas-cuestionario.component';

describe('VerPreguntasCuestionarioComponent', () => {
  let component: VerPreguntasCuestionarioComponent;
  let fixture: ComponentFixture<VerPreguntasCuestionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerPreguntasCuestionarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerPreguntasCuestionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
