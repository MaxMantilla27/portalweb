import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloSilaboComponent } from './modulo-silabo.component';

describe('ModuloSilaboComponent', () => {
  let component: ModuloSilaboComponent;
  let fixture: ComponentFixture<ModuloSilaboComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuloSilaboComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloSilaboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
