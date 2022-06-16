import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VigenciaAccesoPruebaComponent } from './vigencia-acceso-prueba.component';

describe('VigenciaAccesoPruebaComponent', () => {
  let component: VigenciaAccesoPruebaComponent;
  let fixture: ComponentFixture<VigenciaAccesoPruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VigenciaAccesoPruebaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VigenciaAccesoPruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
