import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPagoWompiComponent } from './modal-pago-wompi.component';

describe('ModalPagoWompiComponent', () => {
  let component: ModalPagoWompiComponent;
  let fixture: ComponentFixture<ModalPagoWompiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPagoWompiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPagoWompiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
