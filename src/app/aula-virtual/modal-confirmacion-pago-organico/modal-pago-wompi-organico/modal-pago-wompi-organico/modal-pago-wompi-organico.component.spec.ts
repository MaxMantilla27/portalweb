import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPagoWompiOrganicoComponent } from './modal-pago-wompi-organico.component';

describe('ModalPagoWompiOrganicoComponent', () => {
  let component: ModalPagoWompiOrganicoComponent;
  let fixture: ComponentFixture<ModalPagoWompiOrganicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPagoWompiOrganicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPagoWompiOrganicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
