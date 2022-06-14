import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisPagosComponent } from './mis-pagos.component';

describe('MisPagosComponent', () => {
  let component: MisPagosComponent;
  let fixture: ComponentFixture<MisPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MisPagosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MisPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
