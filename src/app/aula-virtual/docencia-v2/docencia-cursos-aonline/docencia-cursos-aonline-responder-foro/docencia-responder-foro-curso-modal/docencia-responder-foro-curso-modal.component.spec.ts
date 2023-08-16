import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaResponderForoCursoModalComponent } from './docencia-responder-foro-curso-modal.component';

describe('DocenciaResponderForoCursoModalComponent', () => {
  let component: DocenciaResponderForoCursoModalComponent;
  let fixture: ComponentFixture<DocenciaResponderForoCursoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaResponderForoCursoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaResponderForoCursoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
