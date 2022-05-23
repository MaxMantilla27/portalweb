import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloForoInsertComponent } from './modulo-foro-insert.component';

describe('ModuloForoInsertComponent', () => {
  let component: ModuloForoInsertComponent;
  let fixture: ComponentFixture<ModuloForoInsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuloForoInsertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloForoInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
