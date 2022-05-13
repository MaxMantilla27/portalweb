import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoModulosComponent } from './curso-modulos.component';

describe('CursoModulosComponent', () => {
  let component: CursoModulosComponent;
  let fixture: ComponentFixture<CursoModulosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursoModulosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CursoModulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
