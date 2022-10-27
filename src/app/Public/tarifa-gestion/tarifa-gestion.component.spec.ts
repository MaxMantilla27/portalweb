import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarifaGestionComponent } from './tarifa-gestion.component';

describe('TarifaGestionComponent', () => {
  let component: TarifaGestionComponent;
  let fixture: ComponentFixture<TarifaGestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TarifaGestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TarifaGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
