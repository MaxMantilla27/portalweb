import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPagoIzipayOrganicoComponent } from './modal-pago-izipay-organico.component';

describe('ModalPagoIzipayOrganicoComponent', () => {
  let component: ModalPagoIzipayOrganicoComponent;
  let fixture: ComponentFixture<ModalPagoIzipayOrganicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPagoIzipayOrganicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPagoIzipayOrganicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
