import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionWebinarComponent } from './notificacion-webinar.component';

describe('NotificacionWebinarComponent', () => {
  let component: NotificacionWebinarComponent;
  let fixture: ComponentFixture<NotificacionWebinarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotificacionWebinarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacionWebinarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
