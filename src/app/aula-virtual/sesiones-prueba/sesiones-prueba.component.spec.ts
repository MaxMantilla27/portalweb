import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SesionesPruebaComponent } from './sesiones-prueba.component';

describe('SesionesPruebaComponent', () => {
  let component: SesionesPruebaComponent;
  let fixture: ComponentFixture<SesionesPruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SesionesPruebaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SesionesPruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
