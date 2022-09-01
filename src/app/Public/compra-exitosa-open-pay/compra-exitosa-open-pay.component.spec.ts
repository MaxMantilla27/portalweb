import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraExitosaOpenPayComponent } from './compra-exitosa-open-pay.component';

describe('CompraExitosaOpenPayComponent', () => {
  let component: CompraExitosaOpenPayComponent;
  let fixture: ComponentFixture<CompraExitosaOpenPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompraExitosaOpenPayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompraExitosaOpenPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
