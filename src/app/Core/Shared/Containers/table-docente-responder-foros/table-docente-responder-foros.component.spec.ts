import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableDocenteResponderForosComponent } from './table-docente-responder-foros.component';

describe('TableDocenteResponderForosComponent', () => {
  let component: TableDocenteResponderForosComponent;
  let fixture: ComponentFixture<TableDocenteResponderForosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableDocenteResponderForosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableDocenteResponderForosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
