import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePagoPeruYapeComponent } from './detalle-pago-peru-yape.component';

describe('DetallePagoPeruYapeComponent', () => {
  let component: DetallePagoPeruYapeComponent;
  let fixture: ComponentFixture<DetallePagoPeruYapeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetallePagoPeruYapeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePagoPeruYapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
