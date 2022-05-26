import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoProyectoComponent } from './curso-proyecto.component';

describe('CursoProyectoComponent', () => {
  let component: CursoProyectoComponent;
  let fixture: ComponentFixture<CursoProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursoProyectoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CursoProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
