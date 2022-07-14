import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatPruebaComponent } from './chat-prueba.component';

describe('ChatPruebaComponent', () => {
  let component: ChatPruebaComponent;
  let fixture: ComponentFixture<ChatPruebaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatPruebaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatPruebaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
