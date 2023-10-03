import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaPreviaCuestionarioComponent } from './vista-previa-cuestionario.component';

describe('VistaPreviaCuestionarioComponent', () => {
  let component: VistaPreviaCuestionarioComponent;
  let fixture: ComponentFixture<VistaPreviaCuestionarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VistaPreviaCuestionarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaPreviaCuestionarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
