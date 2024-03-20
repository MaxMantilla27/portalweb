import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaCursosAonlineResponderForoComponent } from './docencia-cursos-aonline-responder-foro.component';

describe('DocenciaCursosAonlineResponderForoComponent', () => {
  let component: DocenciaCursosAonlineResponderForoComponent;
  let fixture: ComponentFixture<DocenciaCursosAonlineResponderForoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaCursosAonlineResponderForoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaCursosAonlineResponderForoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
