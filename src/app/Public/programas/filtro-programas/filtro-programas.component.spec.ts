import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltroProgramasComponent } from './filtro-programas.component';

describe('FiltroProgramasComponent', () => {
  let component: FiltroProgramasComponent;
  let fixture: ComponentFixture<FiltroProgramasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltroProgramasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltroProgramasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
