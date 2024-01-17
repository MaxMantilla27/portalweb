import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompraExistosaOpenPayPeruComponent } from './compra-existosa-open-pay-peru.component';

describe('CompraExistosaOpenPayPeruComponent', () => {
  let component: CompraExistosaOpenPayPeruComponent;
  let fixture: ComponentFixture<CompraExistosaOpenPayPeruComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompraExistosaOpenPayPeruComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompraExistosaOpenPayPeruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
