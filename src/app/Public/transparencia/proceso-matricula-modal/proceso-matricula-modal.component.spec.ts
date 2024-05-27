import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcesoMatriculaModalComponent } from './proceso-matricula-modal.component';

describe('ProcesoMatriculaModalComponent', () => {
  let component: ProcesoMatriculaModalComponent;
  let fixture: ComponentFixture<ProcesoMatriculaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcesoMatriculaModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcesoMatriculaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
