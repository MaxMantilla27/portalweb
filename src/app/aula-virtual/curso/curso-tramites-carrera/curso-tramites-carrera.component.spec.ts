import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoTramitesCarreraComponent } from './curso-tramites-carrera.component';

describe('CursoTramitesCarreraComponent', () => {
  let component: CursoTramitesCarreraComponent;
  let fixture: ComponentFixture<CursoTramitesCarreraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursoTramitesCarreraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CursoTramitesCarreraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
