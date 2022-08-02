import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormularioPublicidadComponent } from './formulario-publicidad.component';



describe('FormularioPublicidadComponent', () => {
  let component: FormularioPublicidadComponent;
  let fixture: ComponentFixture<FormularioPublicidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioPublicidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioPublicidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
