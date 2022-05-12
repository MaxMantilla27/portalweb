import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMatriculasComponent } from './card-matriculas.component';

describe('CardMatriculasComponent', () => {
  let component: CardMatriculasComponent;
  let fixture: ComponentFixture<CardMatriculasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardMatriculasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardMatriculasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
