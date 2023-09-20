import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloSesionesOnlineComponent } from './modulo-sesiones-online.component';

describe('ModuloSesionesOnlineComponent', () => {
  let component: ModuloSesionesOnlineComponent;
  let fixture: ComponentFixture<ModuloSesionesOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuloSesionesOnlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloSesionesOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
