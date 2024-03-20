import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionAsistenciaProgramaComponent } from './gestion-asistencia-programa.component';

describe('GestionAsistenciaProgramaComponent', () => {
  let component: GestionAsistenciaProgramaComponent;
  let fixture: ComponentFixture<GestionAsistenciaProgramaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionAsistenciaProgramaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionAsistenciaProgramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
