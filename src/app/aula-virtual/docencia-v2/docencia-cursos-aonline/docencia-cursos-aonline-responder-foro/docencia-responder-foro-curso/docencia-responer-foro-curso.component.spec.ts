import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaResponerForoCursoComponent } from './docencia-responer-foro-curso.component';

describe('DocenciaResponerForoCursoComponent', () => {
  let component: DocenciaResponerForoCursoComponent;
  let fixture: ComponentFixture<DocenciaResponerForoCursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaResponerForoCursoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaResponerForoCursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
