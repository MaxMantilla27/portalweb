import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaCalificarTrabajoParesModalComponent } from './docencia-calificar-trabajo-pares-modal.component';

describe('DocenciaCalificarTrabajoParesModalComponent', () => {
  let component: DocenciaCalificarTrabajoParesModalComponent;
  let fixture: ComponentFixture<DocenciaCalificarTrabajoParesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaCalificarTrabajoParesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaCalificarTrabajoParesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
