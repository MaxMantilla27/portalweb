import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloForoPruebaComponent } from './modulo-foro-prueba.component';

describe('ModuloForoPruebaComponent', () => {
  let component: ModuloForoPruebaComponent;
  let fixture: ComponentFixture<ModuloForoPruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuloForoPruebaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloForoPruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
