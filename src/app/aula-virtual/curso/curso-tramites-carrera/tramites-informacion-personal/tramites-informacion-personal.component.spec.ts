import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TramitesInformacionPersonalComponent } from './tramites-informacion-personal.component';

describe('TramitesInformacionPersonalComponent', () => {
  let component: TramitesInformacionPersonalComponent;
  let fixture: ComponentFixture<TramitesInformacionPersonalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TramitesInformacionPersonalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TramitesInformacionPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
