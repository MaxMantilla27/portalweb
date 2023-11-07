import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamenCarreraComponent } from './examen-carrera.component';

describe('ExamenCarreraComponent', () => {
  let component: ExamenCarreraComponent;
  let fixture: ComponentFixture<ExamenCarreraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamenCarreraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamenCarreraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
