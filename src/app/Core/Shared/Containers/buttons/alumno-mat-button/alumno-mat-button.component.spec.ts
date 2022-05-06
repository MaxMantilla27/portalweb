import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlumnoMatButtonComponent } from './alumno-mat-button.component';

describe('AlumnoMatButtonComponent', () => {
  let component: AlumnoMatButtonComponent;
  let fixture: ComponentFixture<AlumnoMatButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlumnoMatButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlumnoMatButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
