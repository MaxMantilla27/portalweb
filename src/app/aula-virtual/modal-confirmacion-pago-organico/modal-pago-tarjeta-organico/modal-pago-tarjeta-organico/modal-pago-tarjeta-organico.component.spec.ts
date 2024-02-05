import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPagoTarjetaOrganicoComponent } from './modal-pago-tarjeta-organico.component';

describe('ModalPagoTarjetaOrganicoComponent', () => {
  let component: ModalPagoTarjetaOrganicoComponent;
  let fixture: ComponentFixture<ModalPagoTarjetaOrganicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPagoTarjetaOrganicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPagoTarjetaOrganicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
