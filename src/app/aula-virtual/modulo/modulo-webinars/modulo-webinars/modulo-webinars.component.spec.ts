import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloWebinarsComponent } from './modulo-webinars.component';

describe('ModuloWebinarsComponent', () => {
  let component: ModuloWebinarsComponent;
  let fixture: ComponentFixture<ModuloWebinarsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuloWebinarsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloWebinarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
