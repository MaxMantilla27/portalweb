import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TramitesGradoBachillerComponent } from './tramites-grado-bachiller.component';

describe('TramitesGradoBachillerComponent', () => {
  let component: TramitesGradoBachillerComponent;
  let fixture: ComponentFixture<TramitesGradoBachillerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TramitesGradoBachillerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TramitesGradoBachillerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
