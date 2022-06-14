import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloSilaboPruebaComponent } from './modulo-silabo-prueba.component';

describe('ModuloSilaboPruebaComponent', () => {
  let component: ModuloSilaboPruebaComponent;
  let fixture: ComponentFixture<ModuloSilaboPruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuloSilaboPruebaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloSilaboPruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
