import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SilaboDocenteComponent } from './silabo-docente.component';

describe('SilaboDocenteComponent', () => {
  let component: SilaboDocenteComponent;
  let fixture: ComponentFixture<SilaboDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SilaboDocenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SilaboDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
