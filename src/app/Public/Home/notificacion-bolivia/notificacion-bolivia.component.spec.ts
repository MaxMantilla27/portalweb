import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionBoliviaComponent } from './notificacion-bolivia.component';

describe('NotificacionBoliviaComponent', () => {
  let component: NotificacionBoliviaComponent;
  let fixture: ComponentFixture<NotificacionBoliviaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificacionBoliviaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacionBoliviaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
