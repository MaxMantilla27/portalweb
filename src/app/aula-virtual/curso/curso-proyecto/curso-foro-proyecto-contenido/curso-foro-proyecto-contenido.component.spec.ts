import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoForoProyectoContenidoComponent } from './curso-foro-proyecto-contenido.component';

describe('CursoForoProyectoContenidoComponent', () => {
  let component: CursoForoProyectoContenidoComponent;
  let fixture: ComponentFixture<CursoForoProyectoContenidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursoForoProyectoContenidoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CursoForoProyectoContenidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
