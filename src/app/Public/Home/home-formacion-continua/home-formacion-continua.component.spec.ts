import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeFormacionContinuaComponent } from './home-formacion-continua.component';

describe('HomeFormacionContinuaComponent', () => {
  let component: HomeFormacionContinuaComponent;
  let fixture: ComponentFixture<HomeFormacionContinuaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeFormacionContinuaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeFormacionContinuaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
