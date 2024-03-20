import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursosCuestionarioComponent } from './recursos-cuestionario.component';

describe('RecursosCuestionarioComponent', () => {
  let component: RecursosCuestionarioComponent;
  let fixture: ComponentFixture<RecursosCuestionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecursosCuestionarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecursosCuestionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
