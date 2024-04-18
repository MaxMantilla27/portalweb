import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAfiliacionOpenpayPeruComponent } from './modal-afiliacion-openpay-peru.component';

describe('ModalAfiliacionOpenpayPeruComponent', () => {
  let component: ModalAfiliacionOpenpayPeruComponent;
  let fixture: ComponentFixture<ModalAfiliacionOpenpayPeruComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalAfiliacionOpenpayPeruComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAfiliacionOpenpayPeruComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
