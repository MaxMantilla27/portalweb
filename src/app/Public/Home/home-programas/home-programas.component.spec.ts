import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeProgramasComponent } from './home-programas.component';

describe('HomeProgramasComponent', () => {
  let component: HomeProgramasComponent;
  let fixture: ComponentFixture<HomeProgramasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeProgramasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeProgramasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
