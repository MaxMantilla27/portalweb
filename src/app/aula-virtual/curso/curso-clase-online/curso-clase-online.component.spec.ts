import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoClaseOnlineComponent } from './curso-clase-online.component';

describe('CursoClaseOnlineComponent', () => {
  let component: CursoClaseOnlineComponent;
  let fixture: ComponentFixture<CursoClaseOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursoClaseOnlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CursoClaseOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
