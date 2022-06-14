import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloSesionesPruebaComponent } from './modulo-sesiones-prueba.component';

describe('ModuloSesionesPruebaComponent', () => {
  let component: ModuloSesionesPruebaComponent;
  let fixture: ComponentFixture<ModuloSesionesPruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuloSesionesPruebaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloSesionesPruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
