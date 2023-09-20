import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaCursosOnlineComponent } from './docencia-cursos-online.component';

describe('DocenciaCursosOnlineComponent', () => {
  let component: DocenciaCursosOnlineComponent;
  let fixture: ComponentFixture<DocenciaCursosOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaCursosOnlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaCursosOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
