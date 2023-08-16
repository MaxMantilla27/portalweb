import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloCalificacionesOnlineComponent } from './modulo-calificaciones-online.component';

describe('ModuloCalificacionesOnlineComponent', () => {
  let component: ModuloCalificacionesOnlineComponent;
  let fixture: ComponentFixture<ModuloCalificacionesOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuloCalificacionesOnlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloCalificacionesOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
