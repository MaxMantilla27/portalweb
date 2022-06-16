import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloAyudaComponent } from './modulo-ayuda.component';

describe('ModuloAyudaComponent', () => {
  let component: ModuloAyudaComponent;
  let fixture: ComponentFixture<ModuloAyudaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuloAyudaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloAyudaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
