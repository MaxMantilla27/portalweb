import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaGestionNotasComponent } from './docencia-gestion-notas.component';

describe('DocenciaGestionNotasComponent', () => {
  let component: DocenciaGestionNotasComponent;
  let fixture: ComponentFixture<DocenciaGestionNotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaGestionNotasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaGestionNotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
