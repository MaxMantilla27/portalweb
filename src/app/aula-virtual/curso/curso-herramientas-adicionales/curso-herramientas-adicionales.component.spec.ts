import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoHerramientasAdicionalesComponent } from './curso-herramientas-adicionales.component';

describe('CursoHerramientasAdicionalesComponent', () => {
  let component: CursoHerramientasAdicionalesComponent;
  let fixture: ComponentFixture<CursoHerramientasAdicionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursoHerramientasAdicionalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CursoHerramientasAdicionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
