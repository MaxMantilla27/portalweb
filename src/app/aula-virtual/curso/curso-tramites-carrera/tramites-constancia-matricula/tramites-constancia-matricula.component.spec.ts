import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TramitesConstanciaMatriculaComponent } from './tramites-constancia-matricula.component';

describe('TramitesConstanciaMatriculaComponent', () => {
  let component: TramitesConstanciaMatriculaComponent;
  let fixture: ComponentFixture<TramitesConstanciaMatriculaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TramitesConstanciaMatriculaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TramitesConstanciaMatriculaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
