import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PespecificoSesionEsquemaComponent } from './pespecifico-sesion-esquema.component';

describe('PespecificoSesionEsquemaComponent', () => {
  let component: PespecificoSesionEsquemaComponent;
  let fixture: ComponentFixture<PespecificoSesionEsquemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PespecificoSesionEsquemaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PespecificoSesionEsquemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
