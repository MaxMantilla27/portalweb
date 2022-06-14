import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloPruebaComponent } from './modulo-prueba.component';

describe('ModuloPruebaComponent', () => {
  let component: ModuloPruebaComponent;
  let fixture: ComponentFixture<ModuloPruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuloPruebaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloPruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
