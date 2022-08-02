import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPublicidadInterceptorComponent } from './formulario-publicidad-interceptor.component';

describe('FormularioPublicidadInterceptorComponent', () => {
  let component: FormularioPublicidadInterceptorComponent;
  let fixture: ComponentFixture<FormularioPublicidadInterceptorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormularioPublicidadInterceptorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioPublicidadInterceptorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
