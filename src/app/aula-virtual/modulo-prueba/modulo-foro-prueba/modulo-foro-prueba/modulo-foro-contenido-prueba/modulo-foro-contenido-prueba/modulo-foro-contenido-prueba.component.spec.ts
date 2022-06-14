import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloForoContenidoPruebaComponent } from './modulo-foro-contenido-prueba.component';

describe('ModuloForoContenidoPruebaComponent', () => {
  let component: ModuloForoContenidoPruebaComponent;
  let fixture: ComponentFixture<ModuloForoContenidoPruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuloForoContenidoPruebaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloForoContenidoPruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
