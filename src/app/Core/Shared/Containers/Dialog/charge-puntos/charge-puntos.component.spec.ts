import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargePuntosComponent } from './charge-puntos.component';

describe('ChargePuntosComponent', () => {
  let component: ChargePuntosComponent;
  let fixture: ComponentFixture<ChargePuntosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChargePuntosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargePuntosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
