import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaGestionAsistenciaComponent } from './docencia-gestion-asistencia.component';

describe('DocenciaGestionAsistenciaComponent', () => {
  let component: DocenciaGestionAsistenciaComponent;
  let fixture: ComponentFixture<DocenciaGestionAsistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaGestionAsistenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaGestionAsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
