import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatAtencionClienteComponent } from './chat-atencion-cliente.component';

describe('ChatAtencionClienteComponent', () => {
  let component: ChatAtencionClienteComponent;
  let fixture: ComponentFixture<ChatAtencionClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatAtencionClienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatAtencionClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
