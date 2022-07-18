import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaGestionNotasRegistroComponent } from './docencia-gestion-notas-registro.component';

describe('DocenciaGestionNotasRegistroComponent', () => {
  let component: DocenciaGestionNotasRegistroComponent;
  let fixture: ComponentFixture<DocenciaGestionNotasRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaGestionNotasRegistroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaGestionNotasRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
