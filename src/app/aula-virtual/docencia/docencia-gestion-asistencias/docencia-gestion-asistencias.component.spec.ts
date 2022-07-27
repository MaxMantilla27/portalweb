import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaGestionAsistenciasComponent } from './docencia-gestion-asistencias.component';

describe('DocenciaGestionAsistenciasComponent', () => {
  let component: DocenciaGestionAsistenciasComponent;
  let fixture: ComponentFixture<DocenciaGestionAsistenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaGestionAsistenciasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaGestionAsistenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
