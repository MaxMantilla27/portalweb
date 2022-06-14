import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloRecursoPruebaComponent } from './modulo-recurso-prueba.component';

describe('ModuloRecursoPruebaComponent', () => {
  let component: ModuloRecursoPruebaComponent;
  let fixture: ComponentFixture<ModuloRecursoPruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuloRecursoPruebaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloRecursoPruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
