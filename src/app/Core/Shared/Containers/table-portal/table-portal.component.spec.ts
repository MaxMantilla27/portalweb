import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePortalComponent } from './table-portal.component';

describe('TablePortalComponent', () => {
  let component: TablePortalComponent;
  let fixture: ComponentFixture<TablePortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TablePortalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TablePortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
