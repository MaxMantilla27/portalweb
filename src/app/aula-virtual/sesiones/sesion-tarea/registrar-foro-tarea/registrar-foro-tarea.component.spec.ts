import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarForoTareaComponent } from './registrar-foro-tarea.component';

describe('RegistrarForoTareaComponent', () => {
  let component: RegistrarForoTareaComponent;
  let fixture: ComponentFixture<RegistrarForoTareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarForoTareaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarForoTareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
