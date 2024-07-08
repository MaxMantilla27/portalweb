import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatAtencionClienteChatComponent } from './chat-atencion-cliente-chat.component';


describe('ChatAtencionClienteChatComponent', () => {
  let component: ChatAtencionClienteChatComponent;
  let fixture: ComponentFixture<ChatAtencionClienteChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatAtencionClienteChatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatAtencionClienteChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
