import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmCertFisicoComponent } from './confirm-cert-fisico.component';

describe('ConfirmCertFisicoComponent', () => {
  let component: ConfirmCertFisicoComponent;
  let fixture: ComponentFixture<ConfirmCertFisicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmCertFisicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmCertFisicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
