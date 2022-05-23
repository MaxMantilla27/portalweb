import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloForoContenidoComponent } from './modulo-foro-contenido.component';

describe('ModuloForoContenidoComponent', () => {
  let component: ModuloForoContenidoComponent;
  let fixture: ComponentFixture<ModuloForoContenidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuloForoContenidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloForoContenidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
