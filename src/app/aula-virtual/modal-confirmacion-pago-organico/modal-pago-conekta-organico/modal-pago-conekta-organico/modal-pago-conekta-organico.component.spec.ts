import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPagoConektaOrganicoComponent } from './modal-pago-conekta-organico.component';

describe('ModalPagoConektaOrganicoComponent', () => {
  let component: ModalPagoConektaOrganicoComponent;
  let fixture: ComponentFixture<ModalPagoConektaOrganicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPagoConektaOrganicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPagoConektaOrganicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
