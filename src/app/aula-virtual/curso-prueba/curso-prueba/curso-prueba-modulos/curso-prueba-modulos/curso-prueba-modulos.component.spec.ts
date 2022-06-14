import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoPruebaModulosComponent } from './curso-prueba-modulos.component';

describe('CursoPruebaModulosComponent', () => {
  let component: CursoPruebaModulosComponent;
  let fixture: ComponentFixture<CursoPruebaModulosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursoPruebaModulosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CursoPruebaModulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
