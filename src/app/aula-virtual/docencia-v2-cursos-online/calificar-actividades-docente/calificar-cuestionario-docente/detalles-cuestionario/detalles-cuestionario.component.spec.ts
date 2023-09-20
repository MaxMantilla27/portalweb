import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesCuestionarioComponent } from './detalles-cuestionario.component';

describe('DetallesCuestionarioComponent', () => {
  let component: DetallesCuestionarioComponent;
  let fixture: ComponentFixture<DetallesCuestionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallesCuestionarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallesCuestionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
