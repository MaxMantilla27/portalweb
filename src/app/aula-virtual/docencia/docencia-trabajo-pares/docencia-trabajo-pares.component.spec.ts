import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaTrabajoParesComponent } from './docencia-trabajo-pares.component';

describe('DocenciaTrabajoParesComponent', () => {
  let component: DocenciaTrabajoParesComponent;
  let fixture: ComponentFixture<DocenciaTrabajoParesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaTrabajoParesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaTrabajoParesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
