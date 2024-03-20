import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocenciaV2CursosOnlineComponent } from './docencia-v2-cursos-online.component';

describe('DocenciaV2CursosOnlineComponent', () => {
  let component: DocenciaV2CursosOnlineComponent;
  let fixture: ComponentFixture<DocenciaV2CursosOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocenciaV2CursosOnlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocenciaV2CursosOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
