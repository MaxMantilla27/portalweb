import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BolsaTrabajoComponent } from './bolsa-trabajo.component';

describe('BolsaTrabajoComponent', () => {
  let component: BolsaTrabajoComponent;
  let fixture: ComponentFixture<BolsaTrabajoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BolsaTrabajoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BolsaTrabajoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
