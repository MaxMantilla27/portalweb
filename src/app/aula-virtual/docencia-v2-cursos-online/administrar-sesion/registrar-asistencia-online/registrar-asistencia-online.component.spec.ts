import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarAsistenciaOnlineComponent } from './registrar-asistencia-online.component';

describe('RegistrarAsistenciaOnlineComponent', () => {
  let component: RegistrarAsistenciaOnlineComponent;
  let fixture: ComponentFixture<RegistrarAsistenciaOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarAsistenciaOnlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarAsistenciaOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
