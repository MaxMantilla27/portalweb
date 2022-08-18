import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatZComponent } from './chat-z.component';

describe('ChatZComponent', () => {
  let component: ChatZComponent;
  let fixture: ComponentFixture<ChatZComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatZComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatZComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
