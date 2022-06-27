import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramaPagoComponent } from './programa-pago.component';

describe('ProgramaPagoComponent', () => {
  let component: ProgramaPagoComponent;
  let fixture: ComponentFixture<ProgramaPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgramaPagoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgramaPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
