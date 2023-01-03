import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioRojoComponent } from './formulario-rojo.component';

describe('FormularioRojoComponent', () => {
  let component: FormularioRojoComponent;
  let fixture: ComponentFixture<FormularioRojoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioRojoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioRojoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
