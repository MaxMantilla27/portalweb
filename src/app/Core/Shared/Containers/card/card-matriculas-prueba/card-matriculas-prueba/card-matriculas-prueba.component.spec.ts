import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMatriculasPruebaComponent } from './card-matriculas-prueba.component';

describe('CardMatriculasPruebaComponent', () => {
  let component: CardMatriculasPruebaComponent;
  let fixture: ComponentFixture<CardMatriculasPruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardMatriculasPruebaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardMatriculasPruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
