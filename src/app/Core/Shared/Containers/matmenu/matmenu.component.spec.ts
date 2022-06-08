import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatmenuComponent } from './matmenu.component';

describe('MatmenuComponent', () => {
  let component: MatmenuComponent;
  let fixture: ComponentFixture<MatmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatmenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
