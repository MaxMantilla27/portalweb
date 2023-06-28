import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaRecurrenteComponent } from './visa-recurrente.component';

describe('VisaRecurrenteComponent', () => {
  let component: VisaRecurrenteComponent;
  let fixture: ComponentFixture<VisaRecurrenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisaRecurrenteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisaRecurrenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
