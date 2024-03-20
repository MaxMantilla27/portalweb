import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursosTareaComponent } from './recursos-tarea.component';

describe('RecursosTareaComponent', () => {
  let component: RecursosTareaComponent;
  let fixture: ComponentFixture<RecursosTareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecursosTareaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecursosTareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
