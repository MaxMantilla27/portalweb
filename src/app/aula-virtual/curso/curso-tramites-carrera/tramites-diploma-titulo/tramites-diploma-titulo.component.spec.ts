import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TramitesDiplomaTituloComponent } from './tramites-diploma-titulo.component';

describe('TramitesDiplomaTituloComponent', () => {
  let component: TramitesDiplomaTituloComponent;
  let fixture: ComponentFixture<TramitesDiplomaTituloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TramitesDiplomaTituloComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TramitesDiplomaTituloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
