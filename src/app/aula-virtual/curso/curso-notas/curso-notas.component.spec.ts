import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoNotasComponent } from './curso-notas.component';

describe('CursoNotasComponent', () => {
  let component: CursoNotasComponent;
  let fixture: ComponentFixture<CursoNotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursoNotasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CursoNotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
