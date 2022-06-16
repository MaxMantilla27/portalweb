import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarErrorComponent } from './registrar-error.component';

describe('RegistrarErrorComponent', () => {
  let component: RegistrarErrorComponent;
  let fixture: ComponentFixture<RegistrarErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarErrorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
