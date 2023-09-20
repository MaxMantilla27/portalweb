import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsistenciasOnlineComponent } from './asistencias-online.component';

describe('AsistenciasOnlineComponent', () => {
  let component: AsistenciasOnlineComponent;
  let fixture: ComponentFixture<AsistenciasOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsistenciasOnlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsistenciasOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
