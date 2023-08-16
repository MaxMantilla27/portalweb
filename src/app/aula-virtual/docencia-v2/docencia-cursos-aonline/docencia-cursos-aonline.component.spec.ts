import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaCursosAonlineComponent } from './docencia-cursos-aonline.component';

describe('DocenciaCursosAonlineComponent', () => {
  let component: DocenciaCursosAonlineComponent;
  let fixture: ComponentFixture<DocenciaCursosAonlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaCursosAonlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaCursosAonlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
