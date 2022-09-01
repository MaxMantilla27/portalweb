import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CursoVideosSincronicoComponent } from './curso-videos-sincronico.component';

describe('CursoVideosSincronicoComponent', () => {
  let component: CursoVideosSincronicoComponent;
  let fixture: ComponentFixture<CursoVideosSincronicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursoVideosSincronicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CursoVideosSincronicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
