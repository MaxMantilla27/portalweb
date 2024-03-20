import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaV2Component } from './docencia-v2.component';

describe('DocenciaV2Component', () => {
  let component: DocenciaV2Component;
  let fixture: ComponentFixture<DocenciaV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaV2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
