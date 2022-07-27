import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaGestionSilabosComponent } from './docencia-gestion-silabos.component';

describe('DocenciaGestionSilabosComponent', () => {
  let component: DocenciaGestionSilabosComponent;
  let fixture: ComponentFixture<DocenciaGestionSilabosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaGestionSilabosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaGestionSilabosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
