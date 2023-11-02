import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardTramitesCarreraComponent } from './card-tramites-carrera.component';

describe('CardTramitesCarreraComponent', () => {
  let component: CardTramitesCarreraComponent;
  let fixture: ComponentFixture<CardTramitesCarreraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardTramitesCarreraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardTramitesCarreraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
