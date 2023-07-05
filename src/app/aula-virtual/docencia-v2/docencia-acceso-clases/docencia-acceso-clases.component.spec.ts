import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaAccesoClasesComponent } from './docencia-acceso-clases.component';

describe('DocenciaAccesoClasesComponent', () => {
  let component: DocenciaAccesoClasesComponent;
  let fixture: ComponentFixture<DocenciaAccesoClasesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaAccesoClasesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaAccesoClasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
