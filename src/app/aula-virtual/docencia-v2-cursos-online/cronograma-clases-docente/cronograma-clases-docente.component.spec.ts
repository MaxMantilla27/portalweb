import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronogramaClasesDocenteComponent } from './cronograma-clases-docente.component';

describe('CronogramaClasesDocenteComponent', () => {
  let component: CronogramaClasesDocenteComponent;
  let fixture: ComponentFixture<CronogramaClasesDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CronogramaClasesDocenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CronogramaClasesDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
