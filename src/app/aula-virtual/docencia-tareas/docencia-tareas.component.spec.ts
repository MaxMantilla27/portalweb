import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaTareasComponent } from './docencia-tareas.component';

describe('DocenciaTareasComponent', () => {
  let component: DocenciaTareasComponent;
  let fixture: ComponentFixture<DocenciaTareasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaTareasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaTareasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
