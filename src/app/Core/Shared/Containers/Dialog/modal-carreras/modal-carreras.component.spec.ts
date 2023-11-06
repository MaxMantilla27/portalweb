import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCarrerasComponent } from './modal-carreras.component';

describe('ModalCarrerasComponent', () => {
  let component: ModalCarrerasComponent;
  let fixture: ComponentFixture<ModalCarrerasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCarrerasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCarrerasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
