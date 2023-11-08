import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaCarrerasProfesionalesComponent } from './docencia-carreras-profesionales.component';

describe('DocenciaCarrerasProfesionalesComponent', () => {
  let component: DocenciaCarrerasProfesionalesComponent;
  let fixture: ComponentFixture<DocenciaCarrerasProfesionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaCarrerasProfesionalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaCarrerasProfesionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
