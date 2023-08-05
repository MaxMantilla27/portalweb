import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoForoProyectoInsertComponent } from './curso-foro-proyecto-insert.component';

describe('CursoForoProyectoInsertComponent', () => {
  let component: CursoForoProyectoInsertComponent;
  let fixture: ComponentFixture<CursoForoProyectoInsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursoForoProyectoInsertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CursoForoProyectoInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
