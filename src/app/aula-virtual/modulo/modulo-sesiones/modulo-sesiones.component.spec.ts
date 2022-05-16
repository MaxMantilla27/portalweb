import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloSesionesComponent } from './modulo-sesiones.component';

describe('ModuloSesionesComponent', () => {
  let component: ModuloSesionesComponent;
  let fixture: ComponentFixture<ModuloSesionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuloSesionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloSesionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
