import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPagoMercadoPagoChileOrganicoComponent } from './modal-pago-mercado-pago-chile-organico.component';

describe('ModalPagoMercadoPagoChileOrganicoComponent', () => {
  let component: ModalPagoMercadoPagoChileOrganicoComponent;
  let fixture: ComponentFixture<ModalPagoMercadoPagoChileOrganicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPagoMercadoPagoChileOrganicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPagoMercadoPagoChileOrganicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
