import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTrabajoAplicacionComponent } from './modal-trabajo-aplicacion.component';

describe('ModalTrabajoAplicacionComponent', () => {
  let component: ModalTrabajoAplicacionComponent;
  let fixture: ComponentFixture<ModalTrabajoAplicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalTrabajoAplicacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTrabajoAplicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
