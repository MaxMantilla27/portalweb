import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloRecursoComponent } from './modulo-recurso.component';

describe('ModuloRecursoComponent', () => {
  let component: ModuloRecursoComponent;
  let fixture: ComponentFixture<ModuloRecursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuloRecursoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloRecursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
