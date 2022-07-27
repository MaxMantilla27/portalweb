import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPortalComponent } from './chat-portal.component';

describe('ChatPortalComponent', () => {
  let component: ChatPortalComponent;
  let fixture: ComponentFixture<ChatPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatPortalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
