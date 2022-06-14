import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoPruebaComponent } from './curso-prueba.component';

describe('CursoPruebaComponent', () => {
  let component: CursoPruebaComponent;
  let fixture: ComponentFixture<CursoPruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursoPruebaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CursoPruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
