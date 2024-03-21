import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAfiliacionIzipayComponent } from './modal-afiliacion-izipay.component';

describe('ModalAfiliacionIzipayComponent', () => {
  let component: ModalAfiliacionIzipayComponent;
  let fixture: ComponentFixture<ModalAfiliacionIzipayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAfiliacionIzipayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAfiliacionIzipayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
