import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardProgramasComponent } from './card-programas.component';

describe('CardProgramasComponent', () => {
  let component: CardProgramasComponent;
  let fixture: ComponentFixture<CardProgramasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardProgramasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardProgramasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
