import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaForosModalComponent } from './docencia-foros-modal.component';

describe('DocenciaForosModalComponent', () => {
  let component: DocenciaForosModalComponent;
  let fixture: ComponentFixture<DocenciaForosModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaForosModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaForosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
