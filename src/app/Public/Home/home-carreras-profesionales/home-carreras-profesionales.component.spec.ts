import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCarrerasProfesionalesComponent } from './home-carreras-profesionales.component';

describe('HomeCarrerasProfesionalesComponent', () => {
  let component: HomeCarrerasProfesionalesComponent;
  let fixture: ComponentFixture<HomeCarrerasProfesionalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeCarrerasProfesionalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeCarrerasProfesionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
