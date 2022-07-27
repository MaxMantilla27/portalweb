import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaGestionAsistenciasRegistroComponent } from './docencia-gestion-asistencias-registro.component';

describe('DocenciaGestionAsistenciasRegistroComponent', () => {
  let component: DocenciaGestionAsistenciasRegistroComponent;
  let fixture: ComponentFixture<DocenciaGestionAsistenciasRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaGestionAsistenciasRegistroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaGestionAsistenciasRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
