import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPopUpComponent } from './formulario-pop-up.component';

describe('FormularioPopUpComponent', () => {
  let component: FormularioPopUpComponent;
  let fixture: ComponentFixture<FormularioPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioPopUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
