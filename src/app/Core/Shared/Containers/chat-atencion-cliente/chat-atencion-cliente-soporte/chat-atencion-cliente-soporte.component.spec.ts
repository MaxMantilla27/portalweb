import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatAtencionClienteSoporteComponent } from './chat-atencion-cliente-soporte.component';

describe('ChatAtencionClienteSoporteComponent', () => {
  let component: ChatAtencionClienteSoporteComponent;
  let fixture: ComponentFixture<ChatAtencionClienteSoporteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatAtencionClienteSoporteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatAtencionClienteSoporteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
