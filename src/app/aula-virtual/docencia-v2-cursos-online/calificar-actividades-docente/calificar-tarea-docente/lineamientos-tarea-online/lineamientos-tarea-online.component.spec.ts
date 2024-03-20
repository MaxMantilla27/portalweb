import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineamientosTareaOnlineComponent } from './lineamientos-tarea-online.component';

describe('LineamientosTareaOnlineComponent', () => {
  let component: LineamientosTareaOnlineComponent;
  let fixture: ComponentFixture<LineamientosTareaOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineamientosTareaOnlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineamientosTareaOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
