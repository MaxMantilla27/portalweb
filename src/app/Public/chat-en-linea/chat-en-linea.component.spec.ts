import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatEnLineaComponent } from './chat-en-linea.component';

describe('ChatEnLineaComponent', () => {
  let component: ChatEnLineaComponent;
  let fixture: ComponentFixture<ChatEnLineaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatEnLineaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatEnLineaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
