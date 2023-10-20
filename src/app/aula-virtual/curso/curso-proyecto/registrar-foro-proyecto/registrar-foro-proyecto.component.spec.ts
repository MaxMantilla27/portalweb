import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarForoProyectoComponent } from './registrar-foro-proyecto.component';

describe('RegistrarForoProyectoComponent', () => {
  let component: RegistrarForoProyectoComponent;
  let fixture: ComponentFixture<RegistrarForoProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarForoProyectoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarForoProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
