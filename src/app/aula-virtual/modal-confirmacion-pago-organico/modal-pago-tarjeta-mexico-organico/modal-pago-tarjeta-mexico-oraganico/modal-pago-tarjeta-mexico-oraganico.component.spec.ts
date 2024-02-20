import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPagoTarjetaMexicoOraganicoComponent } from './modal-pago-tarjeta-mexico-oraganico.component';

describe('ModalPagoTarjetaMexicoOraganicoComponent', () => {
  let component: ModalPagoTarjetaMexicoOraganicoComponent;
  let fixture: ComponentFixture<ModalPagoTarjetaMexicoOraganicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPagoTarjetaMexicoOraganicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPagoTarjetaMexicoOraganicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
