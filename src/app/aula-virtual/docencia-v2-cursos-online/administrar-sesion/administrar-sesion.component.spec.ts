import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarSesionComponent } from './administrar-sesion.component';

describe('AdministrarSesionComponent', () => {
  let component: AdministrarSesionComponent;
  let fixture: ComponentFixture<AdministrarSesionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministrarSesionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrarSesionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
