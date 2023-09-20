import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaCalificarTrabajoParesComponent } from './docencia-calificar-trabajo-pares.component';

describe('DocenciaCalificarTrabajoParesComponent', () => {
  let component: DocenciaCalificarTrabajoParesComponent;
  let fixture: ComponentFixture<DocenciaCalificarTrabajoParesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaCalificarTrabajoParesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaCalificarTrabajoParesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
