import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramaFormularioComponent } from './programa-formulario.component';

describe('ProgramaFormularioComponent', () => {
  let component: ProgramaFormularioComponent;
  let fixture: ComponentFixture<ProgramaFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramaFormularioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramaFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
