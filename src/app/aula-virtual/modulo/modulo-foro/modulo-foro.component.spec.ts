import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloForoComponent } from './modulo-foro.component';

describe('ModuloForoComponent', () => {
  let component: ModuloForoComponent;
  let fixture: ComponentFixture<ModuloForoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuloForoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloForoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
