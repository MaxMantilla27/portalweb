import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderProgramaComponent } from './header-programa.component';

describe('HeaderProgramaComponent', () => {
  let component: HeaderProgramaComponent;
  let fixture: ComponentFixture<HeaderProgramaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeaderProgramaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderProgramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
