import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaMisPagosComponent } from './cuenta-mis-pagos.component';

describe('CuentaMisPagosComponent', () => {
  let component: CuentaMisPagosComponent;
  let fixture: ComponentFixture<CuentaMisPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuentaMisPagosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaMisPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
