import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaForosComponent } from './docencia-foros.component';

describe('DocenciaForosComponent', () => {
  let component: DocenciaForosComponent;
  let fixture: ComponentFixture<DocenciaForosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaForosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaForosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
