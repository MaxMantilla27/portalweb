import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarCuestionarioComponent } from './agregar-cuestionario.component';

describe('AgregarCuestionarioComponent', () => {
  let component: AgregarCuestionarioComponent;
  let fixture: ComponentFixture<AgregarCuestionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgregarCuestionarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarCuestionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
