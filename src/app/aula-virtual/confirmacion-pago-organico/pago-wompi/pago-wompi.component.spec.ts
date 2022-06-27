import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoWompiComponent } from './pago-wompi.component';

describe('PagoWompiComponent', () => {
  let component: PagoWompiComponent;
  let fixture: ComponentFixture<PagoWompiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagoWompiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoWompiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
