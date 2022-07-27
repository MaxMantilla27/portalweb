import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaGestionSilabosRegistroComponent } from './docencia-gestion-silabos-registro.component';

describe('DocenciaGestionSilabosRegistroComponent', () => {
  let component: DocenciaGestionSilabosRegistroComponent;
  let fixture: ComponentFixture<DocenciaGestionSilabosRegistroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaGestionSilabosRegistroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaGestionSilabosRegistroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
