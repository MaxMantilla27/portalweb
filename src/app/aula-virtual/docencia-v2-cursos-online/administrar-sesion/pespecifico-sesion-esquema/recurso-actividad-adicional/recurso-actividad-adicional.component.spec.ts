import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursoActividadAdicionalComponent } from './recurso-actividad-adicional.component';

describe('RecursoActividadAdicionalComponent', () => {
  let component: RecursoActividadAdicionalComponent;
  let fixture: ComponentFixture<RecursoActividadAdicionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecursoActividadAdicionalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecursoActividadAdicionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
