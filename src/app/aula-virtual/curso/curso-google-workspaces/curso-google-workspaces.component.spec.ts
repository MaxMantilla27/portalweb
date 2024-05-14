import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CursoGoogleWorkspacesComponent } from './curso-google-workspaces.component';


describe('CursoGoogleWorkspacesComponent', () => {
  let component: CursoGoogleWorkspacesComponent;
  let fixture: ComponentFixture<CursoGoogleWorkspacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CursoGoogleWorkspacesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CursoGoogleWorkspacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
