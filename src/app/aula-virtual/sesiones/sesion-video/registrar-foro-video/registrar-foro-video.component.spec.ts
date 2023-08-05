import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarForoVideoComponent } from './registrar-foro-video.component';

describe('RegistrarForoVideoComponent', () => {
  let component: RegistrarForoVideoComponent;
  let fixture: ComponentFixture<RegistrarForoVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarForoVideoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarForoVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
