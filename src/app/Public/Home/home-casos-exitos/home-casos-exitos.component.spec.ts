import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCasosExitosComponent } from './home-casos-exitos.component';

describe('HomeCasosExitosComponent', () => {
  let component: HomeCasosExitosComponent;
  let fixture: ComponentFixture<HomeCasosExitosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeCasosExitosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeCasosExitosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
