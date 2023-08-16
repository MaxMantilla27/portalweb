import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvioCuestionarioComponent } from './envio-cuestionario.component';

describe('EnvioCuestionarioComponent', () => {
  let component: EnvioCuestionarioComponent;
  let fixture: ComponentFixture<EnvioCuestionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnvioCuestionarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvioCuestionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
