import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SesionTareaComponent } from './sesion-tarea.component';

describe('SesionTareaComponent', () => {
  let component: SesionTareaComponent;
  let fixture: ComponentFixture<SesionTareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SesionTareaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SesionTareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
