import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoSimuladoresComponent } from './curso-simuladores.component';

describe('CursoSimuladoresComponent', () => {
  let component: CursoSimuladoresComponent;
  let fixture: ComponentFixture<CursoSimuladoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursoSimuladoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CursoSimuladoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
