import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevolverProyectoComponent } from './devolver-proyecto.component';

describe('DevolverProyectoComponent', () => {
  let component: DevolverProyectoComponent;
  let fixture: ComponentFixture<DevolverProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevolverProyectoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevolverProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
