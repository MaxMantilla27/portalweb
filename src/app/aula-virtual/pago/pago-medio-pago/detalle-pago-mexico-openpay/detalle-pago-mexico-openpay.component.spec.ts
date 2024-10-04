import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePagoMexicoOpenpayComponent } from './detalle-pago-mexico-openpay.component';

describe('DetallePagoMexicoOpenpayComponent', () => {
  let component: DetallePagoMexicoOpenpayComponent;
  let fixture: ComponentFixture<DetallePagoMexicoOpenpayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallePagoMexicoOpenpayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePagoMexicoOpenpayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
