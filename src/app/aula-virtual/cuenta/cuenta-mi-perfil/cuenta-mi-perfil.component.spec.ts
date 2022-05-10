import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CuentaMiPerfilComponent } from './cuenta-mi-perfil.component';

describe('CuentaMiPerfilComponent', () => {
  let component: CuentaMiPerfilComponent;
  let fixture: ComponentFixture<CuentaMiPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CuentaMiPerfilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaMiPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
