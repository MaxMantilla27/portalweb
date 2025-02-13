import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatAtencionClienteAcademicoComponent } from './chat-atencion-cliente-academico.component';

describe('ChatAtencionClienteAcademicoComponent', () => {
  let component: ChatAtencionClienteAcademicoComponent;
  let fixture: ComponentFixture<ChatAtencionClienteAcademicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatAtencionClienteAcademicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatAtencionClienteAcademicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
