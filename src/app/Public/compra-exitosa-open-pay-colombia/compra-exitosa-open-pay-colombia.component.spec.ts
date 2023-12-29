import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraExitosaOpenPayColombiaComponent } from './compra-exitosa-open-pay-colombia.component';

describe('CompraExitosaOpenPayColombiaComponent', () => {
  let component: CompraExitosaOpenPayColombiaComponent;
  let fixture: ComponentFixture<CompraExitosaOpenPayColombiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompraExitosaOpenPayColombiaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompraExitosaOpenPayColombiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
