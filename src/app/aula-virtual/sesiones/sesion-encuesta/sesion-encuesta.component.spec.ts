import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SesionEncuestaComponent } from './sesion-encuesta.component';

describe('SesionEncuestaComponent', () => {
  let component: SesionEncuestaComponent;
  let fixture: ComponentFixture<SesionEncuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SesionEncuestaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SesionEncuestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
