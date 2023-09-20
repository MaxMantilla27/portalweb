import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialEstudioDocenteComponent } from './material-estudio-docente.component';

describe('MaterialEstudioDocenteComponent', () => {
  let component: MaterialEstudioDocenteComponent;
  let fixture: ComponentFixture<MaterialEstudioDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialEstudioDocenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialEstudioDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
