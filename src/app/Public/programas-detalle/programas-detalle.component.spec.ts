import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramasDetalleComponent } from './programas-detalle.component';

describe('ProgramasDetalleComponent', () => {
  let component: ProgramasDetalleComponent;
  let fixture: ComponentFixture<ProgramasDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramasDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramasDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
