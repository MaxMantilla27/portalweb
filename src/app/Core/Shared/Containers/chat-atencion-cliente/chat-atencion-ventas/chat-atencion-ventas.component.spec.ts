import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatAtencionVentasComponent } from './chat-atencion-ventas.component';

describe('ChatAtencionVentasComponent', () => {
  let component: ChatAtencionVentasComponent;
  let fixture: ComponentFixture<ChatAtencionVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatAtencionVentasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatAtencionVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
