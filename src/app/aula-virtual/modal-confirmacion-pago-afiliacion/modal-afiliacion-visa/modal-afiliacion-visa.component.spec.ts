import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAfiliacionVisaComponent } from './modal-afiliacion-visa.component';

describe('ModalAfiliacionVisaComponent', () => {
  let component: ModalAfiliacionVisaComponent;
  let fixture: ComponentFixture<ModalAfiliacionVisaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAfiliacionVisaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAfiliacionVisaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
