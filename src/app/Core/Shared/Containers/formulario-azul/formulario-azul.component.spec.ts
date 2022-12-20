import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioAzulComponent } from './formulario-azul.component';

describe('FormularioAzulComponent', () => {
  let component: FormularioAzulComponent;
  let fixture: ComponentFixture<FormularioAzulComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioAzulComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioAzulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
