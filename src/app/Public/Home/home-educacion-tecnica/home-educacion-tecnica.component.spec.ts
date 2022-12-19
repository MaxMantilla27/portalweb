import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeEducacionTecnicaComponent } from './home-educacion-tecnica.component';

describe('HomeEducacionTecnicaComponent', () => {
  let component: HomeEducacionTecnicaComponent;
  let fixture: ComponentFixture<HomeEducacionTecnicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeEducacionTecnicaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeEducacionTecnicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
