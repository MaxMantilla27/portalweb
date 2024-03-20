import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PespecificoSesionTemaComponent } from './pespecifico-sesion-tema.component';

describe('PespecificoSesionTemaComponent', () => {
  let component: PespecificoSesionTemaComponent;
  let fixture: ComponentFixture<PespecificoSesionTemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PespecificoSesionTemaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PespecificoSesionTemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
