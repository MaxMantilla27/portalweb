import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaSesionesWebinarComponent } from './docencia-sesiones-webinar.component';

describe('DocenciaSesionesWebinarComponent', () => {
  let component: DocenciaSesionesWebinarComponent;
  let fixture: ComponentFixture<DocenciaSesionesWebinarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaSesionesWebinarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaSesionesWebinarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
