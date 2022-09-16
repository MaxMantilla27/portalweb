import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoPagoPSEComponent } from './resultado-pago-pse.component';

describe('ResultadoPagoPSEComponent', () => {
  let component: ResultadoPagoPSEComponent;
  let fixture: ComponentFixture<ResultadoPagoPSEComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultadoPagoPSEComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadoPagoPSEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
