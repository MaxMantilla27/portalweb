import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloVideosSincronicoComponent } from './modulo-videos-sincronico.component';

describe('ModuloVideosSincronicoComponent', () => {
  let component: ModuloVideosSincronicoComponent;
  let fixture: ComponentFixture<ModuloVideosSincronicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuloVideosSincronicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuloVideosSincronicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
