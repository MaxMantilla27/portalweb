import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaGestionSilabosRegistroAddComponent } from './docencia-gestion-silabos-registro-add.component';

describe('DocenciaGestionSilabosRegistroAddComponent', () => {
  let component: DocenciaGestionSilabosRegistroAddComponent;
  let fixture: ComponentFixture<DocenciaGestionSilabosRegistroAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaGestionSilabosRegistroAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaGestionSilabosRegistroAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
