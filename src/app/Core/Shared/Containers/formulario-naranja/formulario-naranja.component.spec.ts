import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioNaranjaComponent } from './formulario-naranja.component';

describe('FormularioNaranjaComponent', () => {
  let component: FormularioNaranjaComponent;
  let fixture: ComponentFixture<FormularioNaranjaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioNaranjaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioNaranjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
