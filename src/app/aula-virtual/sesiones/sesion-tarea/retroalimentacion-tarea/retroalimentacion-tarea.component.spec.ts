import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RetroalimentacionTareaComponent } from './retroalimentacion-tarea.component';

describe('RetroalimentacionTareaComponent', () => {
  let component: RetroalimentacionTareaComponent;
  let fixture: ComponentFixture<RetroalimentacionTareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RetroalimentacionTareaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RetroalimentacionTareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
