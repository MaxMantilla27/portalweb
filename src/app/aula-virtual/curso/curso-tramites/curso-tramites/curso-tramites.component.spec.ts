import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoTramitesComponent } from './curso-tramites.component';

describe('CursoTramitesComponent', () => {
  let component: CursoTramitesComponent;
  let fixture: ComponentFixture<CursoTramitesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursoTramitesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CursoTramitesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
