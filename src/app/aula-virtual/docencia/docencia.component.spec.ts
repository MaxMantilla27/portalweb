import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaComponent } from './docencia.component';

describe('DocenciaComponent', () => {
  let component: DocenciaComponent;
  let fixture: ComponentFixture<DocenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
