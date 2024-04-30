import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagoOrganicoTodosComponent } from './pago-organico-todos.component';

describe('PagoOrganicoTodosComponent', () => {
  let component: PagoOrganicoTodosComponent;
  let fixture: ComponentFixture<PagoOrganicoTodosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagoOrganicoTodosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoOrganicoTodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
