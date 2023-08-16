import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaCursosAonlineCalificarTrabajoParesComponent } from './docencia-cursos-aonline-calificar-trabajo-pares.component';

describe('DocenciaCursosAonlineCalificarTrabajoParesComponent', () => {
  let component: DocenciaCursosAonlineCalificarTrabajoParesComponent;
  let fixture: ComponentFixture<DocenciaCursosAonlineCalificarTrabajoParesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaCursosAonlineCalificarTrabajoParesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaCursosAonlineCalificarTrabajoParesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
