import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloAyudaQuejasSugerenciasComponent } from './modulo-ayuda-quejas-sugerencias.component';

describe('ModuloAyudaQuejasSugerenciasComponent', () => {
  let component: ModuloAyudaQuejasSugerenciasComponent;
  let fixture: ComponentFixture<ModuloAyudaQuejasSugerenciasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuloAyudaQuejasSugerenciasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloAyudaQuejasSugerenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
