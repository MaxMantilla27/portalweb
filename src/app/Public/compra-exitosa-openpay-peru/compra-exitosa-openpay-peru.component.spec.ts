import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraExitosaOpenpayPeruComponent } from './compra-exitosa-openpay-peru.component';

describe('CompraExitosaOpenpayPeruComponent', () => {
  let component: CompraExitosaOpenpayPeruComponent;
  let fixture: ComponentFixture<CompraExitosaOpenpayPeruComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompraExitosaOpenpayPeruComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompraExitosaOpenpayPeruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
